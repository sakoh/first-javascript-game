import Phaser from 'phaser';

export default class Weapon {
  constructor(scene, player, config) {
    this.scene = scene;
    this.player = player;
    
    this.name = config.name;
    this.damage = config.damage;
    this.fireRate = config.fireRate;
    this.projectileSpeed = config.projectileSpeed;
    this.ammo = config.ammo;
    this.maxAmmo = config.maxAmmo;
    this.spread = config.spread || 0;
    this.projectileCount = config.projectileCount || 1;
    this.piercing = config.piercing || false;
    this.explosive = config.explosive || false;
    this.explosionRadius = config.explosionRadius || 0;
    this.chain = config.chain || false;
    this.chainCount = config.chainCount || 0;
    this.chainRange = config.chainRange || 0;
    
    this.lastFireTime = 0;
  }

  fire(time) {
    const actualFireRate = this.fireRate / (1 + this.player.fireRateMultiplier);
    
    if (time - this.lastFireTime < actualFireRate) return;
    if (this.ammo <= 0 && this.ammo !== Infinity) return;
    
    this.lastFireTime = time;
    
    if (this.ammo !== Infinity) {
      this.ammo--;
    }
    
    // Calculate actual projectile count
    const totalProjectiles = this.projectileCount + this.player.extraProjectiles;
    
    for (let i = 0; i < totalProjectiles; i++) {
      this.createProjectile(i, totalProjectiles);
    }
    
    // Recoil
    const recoilForce = 10;
    const angle = this.player.rotation + Math.PI;
    this.player.setVelocity(
      this.player.body.velocity.x + Math.cos(angle) * recoilForce,
      this.player.body.velocity.y + Math.sin(angle) * recoilForce
    );
    
    // Screen shake
    this.scene.cameras.main.shake(50, 0.001);
  }

  createProjectile(index, total) {
    // Calculate spread
    let spreadAngle = 0;
    if (total > 1) {
      const spreadRange = this.spread * (Math.PI / 180);
      spreadAngle = (index - (total - 1) / 2) * (spreadRange / (total - 1));
    } else if (this.spread > 0) {
      spreadAngle = (Math.random() - 0.5) * this.spread * (Math.PI / 180);
    }
    
    const angle = this.player.rotation + spreadAngle;
    
    // Create projectile
    const projectile = this.scene.physics.add.sprite(this.player.x, this.player.y, 'player-temp');
    projectile.setScale(0.5);
    projectile.setTint(0xffff00);
    
    // Calculate damage with crit
    let damage = this.damage * this.player.damageMultiplier;
    if (Math.random() < this.player.critChance) {
      damage *= 2;
      projectile.setTint(0xff00ff); // Purple for crit
    }
    
    projectile.damage = damage;
    projectile.piercing = this.piercing || this.player.piercing;
    projectile.explosive = this.explosive;
    projectile.explosionRadius = this.explosionRadius;
    projectile.chain = this.chain;
    projectile.chainCount = this.chainCount;
    projectile.chainRange = this.chainRange;
    
    // Set velocity
    const speed = this.projectileSpeed * this.player.projectileSpeedMultiplier;
    this.scene.physics.velocityFromRotation(angle, speed, projectile.body.velocity);
    projectile.rotation = angle;
    
    // Add to projectiles group
    const projectilesGroup = this.scene.registry.get('projectilesGroup');
    if (projectilesGroup) {
      projectilesGroup.add(projectile);
    }
    
    // Auto-destroy after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      if (projectile.active) projectile.destroy();
    });
  }

  reload(amount) {
    if (this.ammo === Infinity) return;
    this.ammo = Math.min(this.ammo + amount, this.maxAmmo);
  }
}

