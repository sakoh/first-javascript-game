import { GAME_CONFIG, BIOMES } from '../config.js';

export default class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.roomWidth = GAME_CONFIG.roomWidth;
    this.roomHeight = GAME_CONFIG.roomHeight;
    this.tileSize = GAME_CONFIG.tileSize;
    this.currentRoom = null;
  }

  generateRoom(biome) {
    const biomeConfig = BIOMES[biome];
    
    // Clear existing walls
    const wallsGroup = this.scene.registry.get('wallsGroup');
    if (wallsGroup) {
      wallsGroup.clear(true, true);
    }
    
    // Create room layout
    this.currentRoom = {
      width: this.roomWidth,
      height: this.roomHeight,
      biome: biome,
      tiles: [],
    };
    
    // Generate procedural layout
    const layout = this.generateRoomLayout();
    
    // Create visual tiles
    for (let y = 0; y < this.roomHeight; y++) {
      this.currentRoom.tiles[y] = [];
      for (let x = 0; x < this.roomWidth; x++) {
        const isWall = layout[y][x] === 1;
        this.currentRoom.tiles[y][x] = isWall ? 1 : 0;
        
        const worldX = x * this.tileSize + this.tileSize / 2;
        const worldY = y * this.tileSize + this.tileSize / 2;
        
        if (isWall) {
          // Create wall
          const wall = this.scene.add.rectangle(
            worldX, worldY, 
            this.tileSize, this.tileSize, 
            biomeConfig.wallColor
          );
          this.scene.physics.add.existing(wall, true);
          wallsGroup.add(wall);
        } else {
          // Floor tile
          this.scene.add.rectangle(
            worldX, worldY, 
            this.tileSize, this.tileSize, 
            biomeConfig.floorColor
          );
        }
      }
    }
    
    // Set world bounds
    this.scene.physics.world.setBounds(
      0, 0, 
      this.roomWidth * this.tileSize, 
      this.roomHeight * this.tileSize
    );
  }

  generateRoomLayout() {
    const layout = [];
    
    // Initialize all as floor
    for (let y = 0; y < this.roomHeight; y++) {
      layout[y] = [];
      for (let x = 0; x < this.roomWidth; x++) {
        layout[y][x] = 0;
      }
    }
    
    // Add outer walls
    for (let y = 0; y < this.roomHeight; y++) {
      for (let x = 0; x < this.roomWidth; x++) {
        if (x === 0 || x === this.roomWidth - 1 || y === 0 || y === this.roomHeight - 1) {
          layout[y][x] = 1;
        }
      }
    }
    
    // Add random obstacles
    const obstacleCount = 10 + Math.floor(Math.random() * 10);
    for (let i = 0; i < obstacleCount; i++) {
      const x = 3 + Math.floor(Math.random() * (this.roomWidth - 6));
      const y = 3 + Math.floor(Math.random() * (this.roomHeight - 6));
      const width = 1 + Math.floor(Math.random() * 3);
      const height = 1 + Math.floor(Math.random() * 3);
      
      for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
          if (y + dy < this.roomHeight - 1 && x + dx < this.roomWidth - 1) {
            layout[y + dy][x + dx] = 1;
          }
        }
      }
    }
    
    // Add some pillars
    const pillarCount = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < pillarCount; i++) {
      const x = 5 + Math.floor(Math.random() * (this.roomWidth - 10));
      const y = 5 + Math.floor(Math.random() * (this.roomHeight - 10));
      layout[y][x] = 1;
    }
    
    return layout;
  }

  getPlayerSpawnPoint() {
    // Spawn player near center
    const centerX = (this.roomWidth / 2) * this.tileSize;
    const centerY = (this.roomHeight / 2) * this.tileSize;
    
    return { x: centerX, y: centerY };
  }

  getEnemySpawnPoint() {
    // Find random floor tile away from center
    let attempts = 0;
    while (attempts < 100) {
      const x = 3 + Math.floor(Math.random() * (this.roomWidth - 6));
      const y = 3 + Math.floor(Math.random() * (this.roomHeight - 6));
      
      if (this.currentRoom.tiles[y][x] === 0) {
        const worldX = x * this.tileSize + this.tileSize / 2;
        const worldY = y * this.tileSize + this.tileSize / 2;
        
        const centerX = (this.roomWidth / 2) * this.tileSize;
        const centerY = (this.roomHeight / 2) * this.tileSize;
        const distance = Phaser.Math.Distance.Between(worldX, worldY, centerX, centerY);
        
        if (distance > 150) {
          return { x: worldX, y: worldY };
        }
      }
      attempts++;
    }
    
    // Fallback
    return { 
      x: (this.roomWidth / 4) * this.tileSize, 
      y: (this.roomHeight / 4) * this.tileSize 
    };
  }
}

