import Phaser from 'phaser';
import Player from '../entities/Player.js';
import LevelManager from '../managers/LevelManager.js';
import EnemyManager from '../managers/EnemyManager.js';
import PoolManager from '../managers/PoolManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Initialize managers
    this.poolManager = new PoolManager(this);
    this.registry.set('poolManager', this.poolManager);
    
    this.levelManager = new LevelManager(this);
    this.enemyManager = new EnemyManager(this);
    
    // Create groups
    this.enemiesGroup = this.physics.add.group();
    this.projectilesGroup = this.physics.add.group();
    this.enemyProjectilesGroup = this.physics.add.group();
    this.pickupsGroup = this.physics.add.group();
    this.wallsGroup = this.physics.add.staticGroup();
    
    // Store in registry for other scenes
    this.registry.set('enemiesGroup', this.enemiesGroup);
    this.registry.set('projectilesGroup', this.projectilesGroup);
    this.registry.set('enemyProjectilesGroup', this.enemyProjectilesGroup);
    this.registry.set('pickupsGroup', this.pickupsGroup);
    this.registry.set('wallsGroup', this.wallsGroup);
    
    // Generate initial level
    this.currentBiome = 'facility';
    this.currentRoom = 0;
    this.roomsCleared = 0;
    this.score = 0;
    this.registry.set('score', this.score);
    this.registry.set('roomsCleared', this.roomsCleared);
    
    this.levelManager.generateRoom(this.currentBiome);
    
    // Create player
    const spawnPoint = this.levelManager.getPlayerSpawnPoint();
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.registry.set('player', this.player);
    
    // Setup camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
    
    // Setup collisions
    this.physics.add.collider(this.player, this.wallsGroup);
    this.physics.add.collider(this.enemiesGroup, this.wallsGroup);
    
    this.physics.add.overlap(this.projectilesGroup, this.enemiesGroup, 
      this.hitEnemy, null, this);
    this.physics.add.overlap(this.projectilesGroup, this.wallsGroup, 
      this.hitWall, null, this);
    this.physics.add.overlap(this.player, this.enemiesGroup, 
      this.playerHitByEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemyProjectilesGroup, 
      this.playerHitByProjectile, null, this);
    this.physics.add.overlap(this.player, this.pickupsGroup, 
      this.collectPickup, null, this);
    
    // Spawn initial enemies
    this.enemyManager.spawnWave(this.currentBiome, 1);
    
    // Track room clear
    this.roomActive = true;
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
    }
    
    // Update enemies
    this.enemiesGroup.children.entries.forEach(enemy => {
      if (enemy.active) {
        enemy.update(time, delta);
      }
    });
    
    // Check room clear
    if (this.roomActive && this.enemiesGroup.countActive(true) === 0) {
      this.roomCleared();
    }
  }

  hitEnemy(projectile, enemy) {
    if (!projectile.active || !enemy.active) return;
    
    const damage = projectile.damage || 10;
    const piercing = projectile.piercing || false;
    const explosive = projectile.explosive || false;
    const chain = projectile.chain || false;
    
    enemy.takeDamage(damage);
    
    // Screen shake
    this.cameras.main.shake(100, 0.002);
    
    // Create hit effect
    this.createHitEffect(enemy.x, enemy.y);
    
    if (explosive && projectile.explosionRadius) {
      this.createExplosion(projectile.x, projectile.y, projectile.explosionRadius, damage * 0.5);
    }
    
    if (chain && projectile.chainCount && projectile.chainCount > 0) {
      this.chainLightning(projectile, enemy);
    }
    
    if (!piercing) {
      projectile.destroy();
    }
  }

  hitWall(projectile, wall) {
    if (projectile.active) {
      projectile.destroy();
    }
  }

  playerHitByEnemy(player, enemy) {
    if (player.invincible || !enemy.active) return;
    player.takeDamage(enemy.damage || 10);
  }

  playerHitByProjectile(player, projectile) {
    if (player.invincible || !projectile.active) return;
    player.takeDamage(projectile.damage || 5);
    projectile.destroy();
  }

  collectPickup(player, pickup) {
    pickup.collect(player);
  }

  createHitEffect(x, y) {
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      quantity: 8,
      blendMode: 'ADD',
    });
    
    this.time.delayedCall(300, () => particles.destroy());
  }

  createExplosion(x, y, radius, damage) {
    // Visual explosion
    const explosion = this.add.circle(x, y, 0, 0xff8800, 0.5);
    this.tweens.add({
      targets: explosion,
      radius: radius,
      alpha: 0,
      duration: 300,
      onComplete: () => explosion.destroy(),
    });
    
    // Screen shake
    this.cameras.main.shake(200, 0.005);
    
    // Damage enemies in radius
    this.enemiesGroup.children.entries.forEach(enemy => {
      if (enemy.active) {
        const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
        if (distance < radius) {
          enemy.takeDamage(damage);
        }
      }
    });
  }

  chainLightning(projectile, sourceEnemy) {
    const chainCount = projectile.chainCount - 1;
    const chainRange = projectile.chainRange || 150;
    const damage = projectile.damage * 0.7; // Reduced damage per chain
    
    if (chainCount <= 0) return;
    
    // Find nearest enemy
    let nearest = null;
    let nearestDist = chainRange;
    
    this.enemiesGroup.children.entries.forEach(enemy => {
      if (enemy.active && enemy !== sourceEnemy) {
        const dist = Phaser.Math.Distance.Between(sourceEnemy.x, sourceEnemy.y, enemy.x, enemy.y);
        if (dist < nearestDist) {
          nearest = enemy;
          nearestDist = dist;
        }
      }
    });
    
    if (nearest) {
      // Draw lightning bolt
      const line = this.add.graphics();
      line.lineStyle(2, 0x00ffff, 1);
      line.lineBetween(sourceEnemy.x, sourceEnemy.y, nearest.x, nearest.y);
      this.time.delayedCall(100, () => line.destroy());
      
      // Damage and chain further
      nearest.takeDamage(damage);
      
      if (chainCount > 1) {
        const newProjectile = { ...projectile, chainCount: chainCount, damage: damage };
        this.time.delayedCall(50, () => this.chainLightning(newProjectile, nearest));
      }
    }
  }

  roomCleared() {
    this.roomActive = false;
    this.roomsCleared++;
    this.registry.set('roomsCleared', this.roomsCleared);
    
    // Calculate score
    this.score += 100;
    this.registry.set('score', this.score);
    
    // Show upgrade screen every room
    this.scene.pause();
    this.scene.launch('UpgradeScene');
  }

  nextRoom() {
    this.currentRoom++;
    
    // Change biome every 3 rooms
    if (this.currentRoom % 3 === 0) {
      const biomes = Object.keys(this.registry.get('poolManager').scene.cache.json.get('biomes') || 
        { facility: 1, caves: 1, factory: 1, void: 1 });
      const biomeIndex = Math.floor(this.currentRoom / 3) % 4;
      this.currentBiome = ['facility', 'caves', 'factory', 'void'][biomeIndex];
    }
    
    // Clear existing entities
    this.enemiesGroup.clear(true, true);
    this.projectilesGroup.clear(true, true);
    this.enemyProjectilesGroup.clear(true, true);
    this.pickupsGroup.clear(true, true);
    this.wallsGroup.clear(true, true);
    
    // Generate new room
    this.levelManager.generateRoom(this.currentBiome);
    
    // Respawn player
    const spawnPoint = this.levelManager.getPlayerSpawnPoint();
    this.player.x = spawnPoint.x;
    this.player.y = spawnPoint.y;
    this.player.setVelocity(0, 0);
    
    // Spawn enemies with scaling difficulty
    const difficulty = 1 + (this.currentRoom * 0.2);
    this.enemyManager.spawnWave(this.currentBiome, difficulty);
    
    this.roomActive = true;
  }

  gameOver() {
    this.scene.stop('UIScene');
    this.scene.start('GameOverScene', {
      score: this.score,
      roomsCleared: this.roomsCleared,
    });
  }
}

