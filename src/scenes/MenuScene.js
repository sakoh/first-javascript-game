import Phaser from 'phaser';
import ProgressionManager from '../managers/ProgressionManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Initialize progression manager
    this.progressionManager = new ProgressionManager();
    this.registry.set('progressionManager', this.progressionManager);
    
    // Title
    const title = this.add.text(width / 2, height / 3, 'ROGUELITE SHOOTER', {
      font: 'bold 48px monospace',
      fill: '#ffffff',
    });
    title.setOrigin(0.5);
    
    // Start button
    const startButton = this.add.text(width / 2, height / 2, 'START GAME', {
      font: '32px monospace',
      fill: '#00ff00',
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    
    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });
    
    startButton.on('pointerout', () => {
      startButton.setScale(1.0);
    });
    
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
    
    // Stats display
    const stats = this.progressionManager.getStats();
    const statsText = this.add.text(width / 2, height / 2 + 80, 
      `Meta Currency: ${stats.currency}\nRuns Completed: ${stats.runsCompleted}\nBest Score: ${stats.bestScore}`, {
      font: '16px monospace',
      fill: '#ffff00',
      align: 'center',
    });
    statsText.setOrigin(0.5);
    
    // Controls info
    const controls = this.add.text(width / 2, height - 100, 
      'WASD: Move | Mouse: Aim & Shoot | 1-7: Switch Weapon | Space: Dash', {
      font: '14px monospace',
      fill: '#888888',
      align: 'center',
    });
    controls.setOrigin(0.5);
  }
}

