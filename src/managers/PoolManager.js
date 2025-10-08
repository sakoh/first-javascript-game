export default class PoolManager {
  constructor(scene) {
    this.scene = scene;
    this.pools = {
      projectiles: [],
      particles: [],
      enemies: [],
    };
  }

  getProjectile() {
    let projectile = this.pools.projectiles.find(p => !p.active);
    
    if (!projectile) {
      projectile = this.scene.physics.add.sprite(0, 0, 'player-temp');
      this.pools.projectiles.push(projectile);
    }
    
    projectile.setActive(true);
    projectile.setVisible(true);
    return projectile;
  }

  releaseProjectile(projectile) {
    projectile.setActive(false);
    projectile.setVisible(false);
    projectile.body.stop();
  }

  getParticle() {
    let particle = this.pools.particles.find(p => !p.active);
    
    if (!particle) {
      particle = this.scene.add.sprite(0, 0, 'player-temp');
      this.pools.particles.push(particle);
    }
    
    particle.setActive(true);
    particle.setVisible(true);
    return particle;
  }

  releaseParticle(particle) {
    particle.setActive(false);
    particle.setVisible(false);
  }

  clear() {
    // Clean up all pools
    Object.values(this.pools).forEach(pool => {
      pool.forEach(obj => {
        if (obj.destroy) {
          obj.destroy();
        }
      });
    });
    
    this.pools = {
      projectiles: [],
      particles: [],
      enemies: [],
    };
  }
}

