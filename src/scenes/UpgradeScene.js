import Phaser from 'phaser';
import UpgradeManager from '../managers/UpgradeManager.js';

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Semi-transparent background
    const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    bg.setOrigin(0);
    
    // Title
    const title = this.add.text(width / 2, 100, 'CHOOSE AN UPGRADE', {
      font: 'bold 32px monospace',
      fill: '#ffffff',
    });
    title.setOrigin(0.5);
    
    // Get upgrade manager
    this.upgradeManager = new UpgradeManager(this);
    
    // Get 3 random upgrades
    const upgrades = this.upgradeManager.getRandomUpgrades(3);
    
    // Display upgrade options
    const startX = width / 2 - 300;
    const startY = height / 2 - 50;
    
    upgrades.forEach((upgrade, index) => {
      const x = startX + (index * 300);
      const y = startY;
      
      // Upgrade box
      const box = this.add.rectangle(x, y, 250, 200, 0x333333);
      box.setInteractive({ useHandCursor: true });
      
      // Upgrade name
      const name = this.add.text(x, y - 60, upgrade.name, {
        font: '20px monospace',
        fill: '#ffff00',
        align: 'center',
        wordWrap: { width: 230 },
      });
      name.setOrigin(0.5);
      
      // Description
      let description = '';
      if (upgrade.stat === 'maxHealth') description = `Increase max health by ${upgrade.value}`;
      else if (upgrade.stat.includes('Multiplier')) description = `Increase by ${upgrade.value * 100}%`;
      else description = 'Gain special ability';
      
      const desc = this.add.text(x, y + 20, description, {
        font: '14px monospace',
        fill: '#cccccc',
        align: 'center',
        wordWrap: { width: 230 },
      });
      desc.setOrigin(0.5);
      
      // Hover effects
      box.on('pointerover', () => {
        box.setFillStyle(0x555555);
      });
      
      box.on('pointerout', () => {
        box.setFillStyle(0x333333);
      });
      
      box.on('pointerdown', () => {
        this.selectUpgrade(upgrade);
      });
    });
    
    // Skip button
    const skipButton = this.add.text(width / 2, height - 100, 'SKIP (Heal 20 HP)', {
      font: '18px monospace',
      fill: '#888888',
    });
    skipButton.setOrigin(0.5);
    skipButton.setInteractive({ useHandCursor: true });
    
    skipButton.on('pointerover', () => {
      skipButton.setStyle({ fill: '#ffffff' });
    });
    
    skipButton.on('pointerout', () => {
      skipButton.setStyle({ fill: '#888888' });
    });
    
    skipButton.on('pointerdown', () => {
      const player = this.registry.get('player');
      if (player) {
        player.heal(20);
      }
      this.closeUpgradeScreen();
    });
  }

  selectUpgrade(upgrade) {
    this.upgradeManager.applyUpgrade(upgrade);
    this.closeUpgradeScreen();
  }

  closeUpgradeScreen() {
    this.scene.stop();
    const gameScene = this.scene.get('GameScene');
    gameScene.scene.resume();
    gameScene.nextRoom();
  }
}

