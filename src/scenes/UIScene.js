import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    // Health bar
    this.healthBarBg = this.add.rectangle(20, 20, 204, 24, 0x333333);
    this.healthBarBg.setOrigin(0);
    this.healthBarBg.setScrollFactor(0);
    
    this.healthBar = this.add.rectangle(22, 22, 200, 20, 0xff0000);
    this.healthBar.setOrigin(0);
    this.healthBar.setScrollFactor(0);
    
    this.healthText = this.add.text(122, 32, '', {
      font: '14px monospace',
      fill: '#ffffff',
    });
    this.healthText.setOrigin(0.5);
    this.healthText.setScrollFactor(0);
    
    // Weapon info
    this.weaponText = this.add.text(20, 60, '', {
      font: '16px monospace',
      fill: '#ffff00',
    });
    this.weaponText.setScrollFactor(0);
    
    this.ammoText = this.add.text(20, 85, '', {
      font: '14px monospace',
      fill: '#ffffff',
    });
    this.ammoText.setScrollFactor(0);
    
    // Score
    this.scoreText = this.add.text(this.cameras.main.width - 20, 20, '', {
      font: '20px monospace',
      fill: '#ffffff',
    });
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setScrollFactor(0);
    
    // Rooms cleared
    this.roomsText = this.add.text(this.cameras.main.width - 20, 50, '', {
      font: '16px monospace',
      fill: '#00ff00',
    });
    this.roomsText.setOrigin(1, 0);
    this.roomsText.setScrollFactor(0);
    
    // Minimap placeholder
    this.minimapBg = this.add.rectangle(this.cameras.main.width - 120, 100, 104, 104, 0x000000, 0.5);
    this.minimapBg.setOrigin(0);
    this.minimapBg.setScrollFactor(0);
  }

  update() {
    const player = this.registry.get('player');
    if (player) {
      // Update health
      const healthPercent = player.health / player.maxHealth;
      this.healthBar.width = 200 * healthPercent;
      this.healthText.setText(`${Math.ceil(player.health)} / ${player.maxHealth}`);
      
      // Update weapon info
      if (player.currentWeapon) {
        this.weaponText.setText(player.currentWeapon.name);
        if (player.currentWeapon.ammo === Infinity) {
          this.ammoText.setText('Ammo: ∞');
        } else {
          this.ammoText.setText(`Ammo: ${player.currentWeapon.ammo} / ${player.currentWeapon.maxAmmo}`);
        }
      }
    }
    
    // Update score
    const score = this.registry.get('score') || 0;
    this.scoreText.setText(`Score: ${score}`);
    
    // Update rooms
    const rooms = this.registry.get('roomsCleared') || 0;
    this.roomsText.setText(`Rooms: ${rooms}`);
  }
}

