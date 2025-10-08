import Weapon from '../entities/Weapon.js';
import { WEAPON_CONFIGS } from '../config.js';

export default class Rocket extends Weapon {
  constructor(scene, player) {
    super(scene, player, WEAPON_CONFIGS.rocket);
  }

  createProjectile(index, total) {
    super.createProjectile(index, total);
    
    // Make rocket look different
    const lastProjectile = this.scene.registry.get('projectilesGroup').getLast(true);
    if (lastProjectile) {
      lastProjectile.setTint(0xff8800);
      lastProjectile.setScale(1);
      
      // Add smoke trail
      const particles = this.scene.add.particles(lastProjectile.x, lastProjectile.y, 'player-temp', {
        follow: lastProjectile,
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 300,
        frequency: 50,
        tint: 0x888888,
      });
      
      lastProjectile.particles = particles;
      
      // Clean up particles when projectile is destroyed
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

