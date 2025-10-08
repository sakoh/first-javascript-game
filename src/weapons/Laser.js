import Weapon from '../entities/Weapon.js';
import { WEAPON_CONFIGS } from '../config.js';

export default class Laser extends Weapon {
  constructor(scene, player) {
    super(scene, player, WEAPON_CONFIGS.laser);
  }

  createProjectile(index, total) {
    super.createProjectile(index, total);
    
    // Add laser visual effect
    const angle = this.player.rotation;
    const lastProjectile = this.scene.registry.get('projectilesGroup').getLast(true);
    
    if (lastProjectile) {
      lastProjectile.setTint(0x00ffff);
      lastProjectile.setScale(0.3, 1);
    }
  }
}

