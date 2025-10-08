import { ENEMY_CONFIGS, BIOMES } from '../config.js';
import Enemy from '../entities/Enemy.js';

export default class EnemyManager {
  constructor(scene) {
    this.scene = scene;
  }

  spawnWave(biome, difficultyMultiplier = 1) {
    const biomeConfig = BIOMES[biome];
    const baseEnemyCount = 5 + Math.floor(difficultyMultiplier * 3);
    
    for (let i = 0; i < baseEnemyCount; i++) {
      const enemyType = Phaser.Utils.Array.GetRandom(biomeConfig.enemies);
      const spawnPoint = this.scene.levelManager.getEnemySpawnPoint();
      
      this.spawnEnemy(enemyType, spawnPoint.x, spawnPoint.y, difficultyMultiplier);
    }
  }

  spawnEnemy(type, x, y, difficultyMultiplier = 1) {
    const config = { ...ENEMY_CONFIGS[type] };
    
    // Apply difficulty scaling
    config.health *= difficultyMultiplier;
    config.damage *= difficultyMultiplier;
    config.xp = Math.floor(config.xp * difficultyMultiplier);
    
    const enemy = new Enemy(this.scene, x, y, config);
    
    const enemiesGroup = this.scene.registry.get('enemiesGroup');
    if (enemiesGroup) {
      enemiesGroup.add(enemy);
    }
    
    return enemy;
  }

  spawnBoss(biome) {
    const spawnPoint = this.scene.levelManager.getEnemySpawnPoint();
    
    // Boss is a super-buffed tank enemy
    const config = { ...ENEMY_CONFIGS.tank };
    config.name = `${biome}-boss`;
    config.health *= 10;
    config.damage *= 2;
    config.xp *= 10;
    config.color = 0xff00ff;
    
    const boss = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, config);
    boss.setScale(2);
    boss.isBoss = true;
    
    const enemiesGroup = this.scene.registry.get('enemiesGroup');
    if (enemiesGroup) {
      enemiesGroup.add(boss);
    }
    
    return boss;
  }
}

