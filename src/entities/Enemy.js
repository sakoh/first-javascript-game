import Phaser from 'phaser';
import Pickup from './Pickup.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Use generated pixel art sprite
    const spriteName = `enemy-${config.name.toLowerCase()}`;
    this.setTexture(spriteName);
    this.setOrigin(0.5);
    
    // Different sizes for different enemy types
    if (config.name === 'tank') {
      this.setSize(18, 18);
    } else if (config.name === 'spawner') {
      this.setSize(16, 16);
    } else {
      this.setSize(14, 14);
    }
    
    // Stats
    this.enemyType = config.name;
    this.maxHealth = config.health;
    this.health = this.maxHealth;
    this.speed = config.speed;
    this.damage = config.damage;
    this.attackRange = config.attackRange;
    this.attackCooldown = config.attackCooldown;
    this.xpValue = config.xp;
    this.canAttack = true;
    
    // Special properties
    this.projectileSpeed = config.projectileSpeed || 0;
    this.splitCount = config.splitCount || 0;
    this.teleportCooldown = config.teleportCooldown || 0;
    this.canTeleport = true;
    this.spawnType = config.spawnType || null;
    this.maxSpawns = config.maxSpawns || 0;
    this.currentSpawns = 0;
    
    this.player = scene.registry.get('player');
  }

  update(time, delta) {
    if (!this.active || !this.player || !this.player.active) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
    
    // Special behaviors
    if (this.enemyType === 'spawner') {
      this.spawnerBehavior(time);
      return;
    }
    
    if (this.enemyType === 'teleporter' && this.canTeleport && distance > 200) {
      this.teleport();
    }
    
    // Movement
    if (this.enemyType === 'shooter' && distance < this.attackRange * 1.5) {
      // Shooter maintains distance
      this.scene.physics.moveToObject(this, this.player, -this.speed);
    } else if (distance > this.attackRange) {
      this.scene.physics.moveToObject(this, this.player, this.speed);
    } else {
      this.setVelocity(0, 0);
    }
    
    // Attack
    if (distance < this.attackRange && this.canAttack) {
      this.attack();
    }
  }

  attack() {
    this.canAttack = false;
    
    if (this.projectileSpeed > 0) {
      // Ranged attack
      this.shootAtPlayer();
    }
    // Melee attack is handled by collision in GameScene
    
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true;
    });
  }

  shootAtPlayer() {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
    
    const projectile = this.scene.physics.add.sprite(this.x, this.y, 'projectile-bullet');
    projectile.setTint(0xff0000);
    projectile.setScale(0.8);
    projectile.damage = this.damage;
    
    this.scene.physics.velocityFromRotation(angle, this.projectileSpeed, projectile.body.velocity);
    
    const enemyProjectilesGroup = this.scene.registry.get('enemyProjectilesGroup');
    if (enemyProjectilesGroup) {
      enemyProjectilesGroup.add(projectile);
    }
    
    // Destroy after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      if (projectile.active) projectile.destroy();
    });
  }

  teleport() {
    this.canTeleport = false;
    
    // Visual effect
    this.setAlpha(0.3);
    
    // Teleport near player
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const newX = this.player.x + Math.cos(angle) * distance;
    const newY = this.player.y + Math.sin(angle) * distance;
    
    this.setPosition(newX, newY);
    
    this.scene.time.delayedCall(200, () => {
      this.setAlpha(1);
    });
    
    this.scene.time.delayedCall(this.teleportCooldown, () => {
      this.canTeleport = true;
    });
  }

  spawnerBehavior(time) {
    if (this.currentSpawns < this.maxSpawns && this.canAttack) {
      this.spawnMinion();
      this.canAttack = false;
      this.scene.time.delayedCall(this.attackCooldown, () => {
        this.canAttack = true;
      });
    }
  }

  spawnMinion() {
    const enemyManager = this.scene.enemyManager;
    if (enemyManager) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40;
      const spawnX = this.x + Math.cos(angle) * distance;
      const spawnY = this.y + Math.sin(angle) * distance;
      
      enemyManager.spawnEnemy(this.spawnType, spawnX, spawnY);
      this.currentSpawns++;
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    
    // Visual feedback
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
    
    // Life steal for player
    if (this.player && this.player.lifeSteal > 0) {
      this.player.heal(amount * this.player.lifeSteal);
    }
    
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    // Splitter behavior
    if (this.enemyType === 'splitter' && this.splitCount > 0) {
      this.split();
    }
    
    // Drop pickup
    if (Math.random() < 0.3) {
      new Pickup(this.scene, this.x, this.y, 'health');
    } else if (Math.random() < 0.2) {
      new Pickup(this.scene, this.x, this.y, 'ammo');
    }
    
    // Death effect
    const spriteName = `enemy-${this.enemyType.toLowerCase()}`;
    const particles = this.scene.add.particles(this.x, this.y, spriteName, {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      quantity: 8,
    });
    
    this.scene.time.delayedCall(300, () => particles.destroy());
    
    // Update score
    const currentScore = this.scene.registry.get('score') || 0;
    this.scene.registry.set('score', currentScore + this.xpValue);
    
    this.destroy();
  }

  split() {
    const enemyManager = this.scene.enemyManager;
    if (enemyManager) {
      for (let i = 0; i < this.splitCount; i++) {
        const angle = (Math.PI * 2 / this.splitCount) * i;
        const distance = 30;
        const spawnX = this.x + Math.cos(angle) * distance;
        const spawnY = this.y + Math.sin(angle) * distance;
        
        // Spawn smaller, weaker version
        const smallerEnemy = enemyManager.spawnEnemy('chaser', spawnX, spawnY);
        if (smallerEnemy) {
          smallerEnemy.setScale(0.7);
          smallerEnemy.maxHealth *= 0.5;
          smallerEnemy.health = smallerEnemy.maxHealth;
          smallerEnemy.damage *= 0.7;
        }
      }
    }
  }
}

