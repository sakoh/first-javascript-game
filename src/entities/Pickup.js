import Phaser from 'phaser';

export default class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.pickupType = type;
    
    // Create visual representation
    const graphics = scene.add.graphics();
    
    if (type === 'health') {
      graphics.fillStyle(0x00ff00, 1);
      graphics.fillRect(2, 6, 4, 8);
      graphics.fillRect(0, 8, 8, 4);
    } else if (type === 'ammo') {
      graphics.fillStyle(0xffff00, 1);
      graphics.fillRect(3, 2, 2, 12);
      graphics.fillRect(1, 4, 6, 2);
    }
    
    graphics.generateTexture(`pickup-${type}`, 8, 16);
    graphics.destroy();
    
    this.setTexture(`pickup-${type}`);
    this.setOrigin(0.5);
    this.setSize(8, 8);
    
    // Add to pickups group
    const pickupsGroup = scene.registry.get('pickupsGroup');
    if (pickupsGroup) {
      pickupsGroup.add(this);
    }
    
    // Floating animation
    scene.tweens.add({
      targets: this,
      y: y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Auto-destroy after 10 seconds
    scene.time.delayedCall(10000, () => {
      if (this.active) this.destroy();
    });
  }

  collect(player) {
    if (this.pickupType === 'health') {
      player.heal(20);
    } else if (this.pickupType === 'ammo') {
      // Refill current weapon ammo
      if (player.currentWeapon && player.currentWeapon.ammo !== Infinity) {
        player.currentWeapon.ammo = Math.min(
          player.currentWeapon.ammo + player.currentWeapon.maxAmmo * 0.3,
          player.currentWeapon.maxAmmo
        );
      }
    }
    
    this.destroy();
  }
}

