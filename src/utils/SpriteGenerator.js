export default class SpriteGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateAllSprites() {
    this.generatePlayerSprite();
    this.generateEnemySprites();
    this.generateWeaponSprites();
    this.generateProjectileSprites();
    this.generateParticleSprite();
    this.generatePickupSprites();
    this.generateUIElements();
  }

  generatePlayerSprite() {
    const size = 16;
    const graphics = this.scene.add.graphics();
    
    // Create pixel art player (top-down character)
    const pixels = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,3,3,2,2,3,3,2,1,0,0,0],
      [0,0,0,1,2,3,3,2,2,3,3,2,1,0,0,0],
      [0,0,0,1,2,2,2,4,4,2,2,2,1,0,0,0],
      [0,0,0,0,1,2,4,4,4,4,2,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,5,1,1,1,1,5,1,0,0,0,0],
      [0,0,0,1,5,5,5,1,1,5,5,5,1,0,0,0],
      [0,0,1,5,5,5,5,1,1,5,5,5,5,1,0,0],
      [0,0,1,5,5,5,1,0,0,1,5,5,5,1,0,0],
      [0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x1a1a1a, // Outline
      2: 0x00ff00, // Body green
      3: 0xffffff, // Eyes white
      4: 0xff6600, // Mouth orange
      5: 0x006600, // Legs dark green
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('player-sprite', size, size);
    graphics.destroy();
  }

  generateEnemySprites() {
    // Chaser (red aggressive enemy)
    this.generateChaserSprite();
    
    // Shooter (blue ranged enemy)
    this.generateShooterSprite();
    
    // Tank (green heavy enemy)
    this.generateTankSprite();
    
    // Splitter (yellow splitting enemy)
    this.generateSplitterSprite();
    
    // Teleporter (purple blinking enemy)
    this.generateTeleporterSprite();
    
    // Spawner (cyan stationary enemy)
    this.generateSpawnerSprite();
  }

  generateChaserSprite() {
    const size = 16;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0],
      [0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,4,4,4,4,4,4,2,2,2,1,0],
      [0,1,2,2,4,4,4,4,4,4,4,4,2,2,1,0],
      [0,1,2,2,2,2,4,4,4,4,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x330000,
      2: 0xff4444,
      3: 0xffff00,
      4: 0x990000,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-chaser', size, size);
    graphics.destroy();
  }

  generateShooterSprite() {
    const size = 16;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,3,3,2,2,2,2,3,3,2,1,0,0],
      [0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,4,4,4,4,2,2,2,2,2,1],
      [1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1],
      [1,2,2,2,2,2,4,4,4,4,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0],
      [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x000033,
      2: 0x4444ff,
      3: 0x00ffff,
      4: 0x0000aa,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-shooter', size, size);
    graphics.destroy();
  }

  generateTankSprite() {
    const size = 20;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,3,3,3,2,2,2,2,3,3,3,2,2,1,0,0],
      [0,1,2,2,2,3,3,3,2,2,2,2,3,3,3,2,2,2,1,0],
      [0,1,2,2,2,3,3,3,2,2,2,2,3,3,3,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,1],
      [1,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,1],
      [1,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x003300,
      2: 0x44ff44,
      3: 0xff0000,
      4: 0x00aa00,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-tank', size, size);
    graphics.destroy();
  }

  generateSplitterSprite() {
    const size = 16;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,3,3,2,2,3,3,2,1,0,0,0],
      [0,0,1,2,2,3,3,2,2,3,3,2,2,1,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,4,4,4,4,4,4,2,2,2,1,0],
      [1,2,2,2,4,4,4,4,4,4,4,4,2,2,2,1],
      [1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x333300,
      2: 0xffff44,
      3: 0x00ff00,
      4: 0xaaaa00,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-splitter', size, size);
    graphics.destroy();
  }

  generateTeleporterSprite() {
    const size = 16;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,3,2,2,2,2,3,2,1,0,0,0],
      [0,0,1,2,3,3,3,2,2,3,3,3,2,1,0,0],
      [0,1,2,2,3,4,3,2,2,3,4,3,2,2,1,0],
      [0,1,2,2,3,3,3,2,2,3,3,3,2,2,1,0],
      [0,1,2,2,2,3,2,2,2,2,3,2,2,2,1,0],
      [0,1,2,2,2,2,2,5,5,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,5,5,5,5,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,5,5,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x330033,
      2: 0xff44ff,
      3: 0x00ffff,
      4: 0xffffff,
      5: 0xaa00aa,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-teleporter', size, size);
    graphics.destroy();
  }

  generateSpawnerSprite() {
    const size = 18;
    const graphics = this.scene.add.graphics();
    
    const pixels = [
      [0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0,0],
      [0,1,2,2,3,3,3,3,2,2,3,3,3,3,2,2,1,0],
      [0,1,2,2,2,3,3,2,2,2,2,3,3,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,4,4,4,4,4,4,4,4,2,2,2,2,1],
      [1,2,2,2,4,4,5,5,5,5,5,5,4,4,2,2,2,1],
      [1,2,2,2,4,4,5,5,5,5,5,5,4,4,2,2,2,1],
      [1,2,2,2,2,4,4,4,4,4,4,4,4,2,2,2,2,1],
      [1,2,2,2,2,2,2,4,4,4,4,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,4,4,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x003333,
      2: 0x44ffff,
      3: 0xff00ff,
      4: 0x00aaaa,
      5: 0x006666,
    };
    
    this.drawPixelArt(graphics, pixels, colors, size);
    graphics.generateTexture('enemy-spawner', size, size);
    graphics.destroy();
  }

  generateWeaponSprites() {
    const weapons = [
      { name: 'pistol', color: 0x888888 },
      { name: 'smg', color: 0x666666 },
      { name: 'shotgun', color: 0xaa6600 },
      { name: 'sniper', color: 0x444444 },
      { name: 'laser', color: 0x00ffff },
      { name: 'rocket', color: 0xff6600 },
      { name: 'lightning', color: 0xffff00 },
    ];
    
    weapons.forEach(weapon => {
      const size = 12;
      const graphics = this.scene.add.graphics();
      
      // Simple weapon sprite (side view)
      graphics.fillStyle(0x000000, 1);
      graphics.fillRect(0, 4, 12, 4);
      graphics.fillStyle(weapon.color, 1);
      graphics.fillRect(0, 5, 11, 2);
      graphics.fillRect(8, 4, 4, 4);
      
      graphics.generateTexture(`weapon-${weapon.name}`, size, size);
      graphics.destroy();
    });
  }

  generateProjectileSprites() {
    // Regular bullet
    const graphics1 = this.scene.add.graphics();
    graphics1.fillStyle(0xffff00, 1);
    graphics1.fillCircle(4, 4, 3);
    graphics1.fillStyle(0xffffff, 1);
    graphics1.fillCircle(4, 4, 2);
    graphics1.generateTexture('projectile-bullet', 8, 8);
    graphics1.destroy();
    
    // Laser projectile
    const graphics2 = this.scene.add.graphics();
    graphics2.fillStyle(0x00ffff, 1);
    graphics2.fillRect(0, 2, 12, 4);
    graphics2.fillStyle(0xffffff, 1);
    graphics2.fillRect(0, 3, 12, 2);
    graphics2.generateTexture('projectile-laser', 12, 8);
    graphics2.destroy();
    
    // Rocket
    const graphics3 = this.scene.add.graphics();
    graphics3.fillStyle(0xff6600, 1);
    graphics3.fillRect(0, 2, 10, 4);
    graphics3.fillStyle(0xff0000, 1);
    graphics3.fillRect(0, 3, 2, 2);
    graphics3.fillStyle(0xffff00, 1);
    graphics3.fillRect(8, 2, 2, 4);
    graphics3.generateTexture('projectile-rocket', 10, 8);
    graphics3.destroy();
  }

  generateParticleSprite() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }

  generatePickupSprites() {
    // Health pickup (heart)
    const size = 12;
    const graphics = this.scene.add.graphics();
    
    const heartPixels = [
      [0,0,1,1,0,0,0,1,1,0,0,0],
      [0,1,2,2,1,0,1,2,2,1,0,0],
      [1,2,2,2,2,1,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const colors = {
      0: null,
      1: 0x880000,
      2: 0xff0000,
    };
    
    this.drawPixelArt(graphics, heartPixels, colors, size);
    graphics.generateTexture('pickup-health', size, size);
    graphics.destroy();
    
    // Ammo pickup (bullet box)
    const graphics2 = this.scene.add.graphics();
    
    const ammoPixels = [
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,3,3,3,3,2,1,0,0],
      [0,0,1,2,3,3,3,3,2,1,0,0],
      [0,0,1,2,3,3,3,3,2,1,0,0],
      [0,0,1,2,3,3,3,3,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    
    const ammoColors = {
      0: null,
      1: 0x333333,
      2: 0xffff00,
      3: 0xffaa00,
    };
    
    this.drawPixelArt(graphics2, ammoPixels, ammoColors, size);
    graphics2.generateTexture('pickup-ammo', size, size);
    graphics2.destroy();
  }

  generateUIElements() {
    // Heart icon for health
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(2, 4, 4, 4);
    graphics.fillRect(6, 4, 4, 4);
    graphics.fillRect(1, 5, 10, 6);
    graphics.generateTexture('ui-heart', 12, 12);
    graphics.destroy();
  }

  drawPixelArt(graphics, pixels, colors, size) {
    const pixelSize = size / pixels.length;
    
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const colorKey = pixels[y][x];
        const color = colors[colorKey];
        
        if (color !== null) {
          graphics.fillStyle(color, 1);
          graphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }
}


