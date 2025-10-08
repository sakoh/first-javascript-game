import Enemy from './Enemy.js';
import Pickup from './Pickup.js';

export default class Boss extends Enemy {
  constructor(scene, x, y, biome) {
    // Create boss config based on biome
    const config = {
      name: `${biome}-boss`,
      health: 500,
      speed: 50,
      damage: 25,
      attackRange: 300,
      attackCooldown: 2000,
      xp: 500,
      color: 0xff00ff,
      projectileSpeed: 250,
    };
    
    super(scene, x, y, config);
    
    this.biome = biome;
    this.isBoss = true;
    this.phase = 1;
    this.maxPhases = 3;
    
    // Scale up visually
    this.setScale(2.5);
    
    // Phase-specific behaviors
    this.phaseThresholds = [0.66, 0.33];
  }

  update(time, delta) {
    if (!this.active || !this.player || !this.player.active) return;
    
    // Check phase transitions
    const healthPercent = this.health / this.maxHealth;
    if (this.phase === 1 && healthPercent < this.phaseThresholds[0]) {
      this.enterPhase2();
    } else if (this.phase === 2 && healthPercent < this.phaseThresholds[1]) {
      this.enterPhase3();
    }
    
    // Phase-specific AI
    if (this.phase === 1) {
      this.phase1Behavior();
    } else if (this.phase === 2) {
      this.phase2Behavior();
    } else if (this.phase === 3) {
      this.phase3Behavior();
    }
  }

  phase1Behavior() {
    // Normal enemy behavior
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
    
    if (distance > this.attackRange * 0.8) {
      this.scene.physics.moveToObject(this, this.player, this.speed);
    } else {
      this.setVelocity(0, 0);
    }
    
    if (distance < this.attackRange && this.canAttack) {
      this.attack();
    }
  }

  phase2Behavior() {
    // Faster, more aggressive
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
    
    this.scene.physics.moveToObject(this, this.player, this.speed * 1.5);
    
    if (distance < this.attackRange && this.canAttack) {
      this.burstAttack();
    }
  }

  phase3Behavior() {
    // Erratic movement with heavy attacks
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
    
    // Circle around player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
    const perpAngle = angle + Math.PI / 2;
    
    const moveX = Math.cos(perpAngle) * this.speed * 2;
    const moveY = Math.sin(perpAngle) * this.speed * 2;
    
    const towardsX = Math.cos(angle) * this.speed * 0.5;
    const towardsY = Math.sin(angle) * this.speed * 0.5;
    
    this.setVelocity(moveX + towardsX, moveY + towardsY);
    
    if (distance < this.attackRange && this.canAttack) {
      this.spiralAttack();
    }
  }

  enterPhase2() {
    this.phase = 2;
    this.attackCooldown *= 0.7;
    this.setTint(0xff6600);
    
    // Screen flash
    this.scene.cameras.main.flash(500, 255, 100, 0);
    this.scene.cameras.main.shake(300, 0.01);
  }

  enterPhase3() {
    this.phase = 3;
    this.attackCooldown *= 0.5;
    this.setTint(0xff0000);
    
    // Screen flash
    this.scene.cameras.main.flash(500, 255, 0, 0);
    this.scene.cameras.main.shake(500, 0.02);
  }

  attack() {
    super.attack();
    
    // Shoot 3 projectiles in a spread
    for (let i = -1; i <= 1; i++) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
      const spreadAngle = angle + (i * 0.3);
      
      const projectile = this.scene.physics.add.sprite(this.x, this.y, 'player-temp');
      projectile.setTint(0xff00ff);
      projectile.setScale(0.8);
      projectile.damage = this.damage;
      
      this.scene.physics.velocityFromRotation(spreadAngle, this.projectileSpeed, projectile.body.velocity);
      
      const enemyProjectilesGroup = this.scene.registry.get('enemyProjectilesGroup');
      if (enemyProjectilesGroup) {
        enemyProjectilesGroup.add(projectile);
      }
      
      this.scene.time.delayedCall(5000, () => {
        if (projectile.active) projectile.destroy();
      });
    }
  }

  burstAttack() {
    this.canAttack = false;
    
    // Fire 8 projectiles in a circle
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      
      const projectile = this.scene.physics.add.sprite(this.x, this.y, 'player-temp');
      projectile.setTint(0xff6600);
      projectile.setScale(0.7);
      projectile.damage = this.damage * 0.8;
      
      this.scene.physics.velocityFromRotation(angle, this.projectileSpeed, projectile.body.velocity);
      
      const enemyProjectilesGroup = this.scene.registry.get('enemyProjectilesGroup');
      if (enemyProjectilesGroup) {
        enemyProjectilesGroup.add(projectile);
      }
      
      this.scene.time.delayedCall(5000, () => {
        if (projectile.active) projectile.destroy();
      });
    }
    
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true;
    });
  }

  spiralAttack() {
    this.canAttack = false;
    
    // Fire spiral pattern
    let projectileCount = 0;
    const spiralInterval = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        const angle = (projectileCount * 0.5);
        
        const projectile = this.scene.physics.add.sprite(this.x, this.y, 'player-temp');
        projectile.setTint(0xff0000);
        projectile.setScale(0.6);
        projectile.damage = this.damage * 0.6;
        
        this.scene.physics.velocityFromRotation(angle, this.projectileSpeed, projectile.body.velocity);
        
        const enemyProjectilesGroup = this.scene.registry.get('enemyProjectilesGroup');
        if (enemyProjectilesGroup) {
          enemyProjectilesGroup.add(projectile);
        }
        
        this.scene.time.delayedCall(5000, () => {
          if (projectile.active) projectile.destroy();
        });
        
        projectileCount++;
        if (projectileCount >= 20) {
          spiralInterval.remove();
        }
      },
      repeat: 19,
    });
    
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true;
    });
  }

  die() {
    // Epic death effect
    this.scene.cameras.main.shake(1000, 0.03);
    this.scene.cameras.main.flash(1000, 255, 255, 255);
    
    // Explosion particles
    const particles = this.scene.add.particles(this.x, this.y, `enemy-${this.enemyType}`, {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 2, end: 0 },
      lifespan: 1000,
      quantity: 30,
    });
    
    this.scene.time.delayedCall(1000, () => particles.destroy());
    
    // Drop guaranteed rewards
    new Pickup(this.scene, this.x - 30, this.y, 'health');
    new Pickup(this.scene, this.x + 30, this.y, 'health');
    new Pickup(this.scene, this.x, this.y - 30, 'ammo');
    new Pickup(this.scene, this.x, this.y + 30, 'ammo');
    
    // Update score
    const currentScore = this.scene.registry.get('score') || 0;
    this.scene.registry.set('score', currentScore + this.xpValue);
    
    this.destroy();
  }
}

