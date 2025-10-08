import Weapon from '../entities/Weapon.js';
import { WEAPON_CONFIGS } from '../config.js';

export default class Lightning extends Weapon {
  constructor(scene, player) {
    super(scene, player, WEAPON_CONFIGS.lightning);
  }

  createProjectile(index, total) {
    super.createProjectile(index, total);
    
    const lastProjectile = this.scene.registry.get('projectilesGroup').getLast(true);
    if (lastProjectile) {
      lastProjectile.setTint(0x00ffff);
      
      // Add electric effect
      const particles = this.scene.add.particles(lastProjectile.x, lastProjectile.y, 'particle', {
        follow: lastProjectile,
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 200,
        frequency: 30,
        tint: 0x00ffff,
      });
      
      lastProjectile.particles = particles;
      
      const originalDestroy = lastProjectile.destroy.bind(lastProjectile);
      lastProjectile.destroy = function() {
        if (this.particles) {
          this.particles.destroy();
        }
        originalDestroy();
      };
    }
  }
}

