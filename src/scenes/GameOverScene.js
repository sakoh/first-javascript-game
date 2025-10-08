import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const score = data.score || 0;
    const roomsCleared = data.roomsCleared || 0;
    
    // Title
    const title = this.add.text(width / 2, height / 3, 'GAME OVER', {
      font: 'bold 48px monospace',
      fill: '#ff0000',
    });
    title.setOrigin(0.5);
    
    // Stats
    const currencyEarned = Math.floor(score / 10);
    const statsText = this.add.text(width / 2, height / 2, 
      `Score: ${score}\nRooms Cleared: ${roomsCleared}\nCurrency Earned: ${currencyEarned}`, {
      font: '24px monospace',
      fill: '#ffffff',
      align: 'center',
    });
    statsText.setOrigin(0.5);
    
    // Update meta-progression
    const progressionManager = this.registry.get('progressionManager');
    if (progressionManager) {
      progressionManager.addCurrency(currencyEarned);
      progressionManager.incrementRuns();
      progressionManager.updateBestScore(score);
    }
    
    // Return to menu button
    const menuButton = this.add.text(width / 2, height - 150, 'RETURN TO MENU', {
      font: '32px monospace',
      fill: '#00ff00',
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setScale(1.0);
    });
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}

