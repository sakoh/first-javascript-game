import Phaser from 'phaser';
import { PLAYER_CONFIG } from '../config.js';
import Pistol from '../weapons/Pistol.js';
import SMG from '../weapons/SMG.js';
import Shotgun from '../weapons/Shotgun.js';
import Sniper from '../weapons/Sniper.js';
import Laser from '../weapons/Laser.js';
import Rocket from '../weapons/Rocket.js';
import Lightning from '../weapons/Lightning.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Create visual representation
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x00ff00, 1);
    this.graphics.fillRect(-8, -8, 16, 16);
    this.graphics.generateTexture('player-temp', 16, 16);
    this.graphics.destroy();
    
    this.setTexture('player-temp');
    this.setOrigin(0.5);
    this.setCollideWorldBounds(true);
    this.setSize(14, 14);
    
    // Stats
    this.maxHealth = PLAYER_CONFIG.maxHealth;
    this.health = this.maxHealth;
    this.speed = PLAYER_CONFIG.speed;
    this.invincible = false;
    
    // Dash
    this.dashSpeed = PLAYER_CONFIG.dashSpeed;
    this.dashDuration = PLAYER_CONFIG.dashDuration;
    this.dashCooldown = PLAYER_CONFIG.dashCooldown;
    this.canDash = true;
    this.isDashing = false;
    
    // Stat multipliers (from upgrades)
    this.damageMultiplier = 1;
    this.fireRateMultiplier = 1;
    this.speedMultiplier = 1;
    this.projectileSpeedMultiplier = 1;
    this.extraProjectiles = 0;
    this.lifeSteal = 0;
    this.critChance = 0;
    this.dashCooldownReduction = 0;
    this.piercing = false;
    
    // Initialize weapons
    this.weapons = [
      new Pistol(scene, this),
      new SMG(scene, this),
      new Shotgun(scene, this),
      new Sniper(scene, this),
      new Laser(scene, this),
      new Rocket(scene, this),
      new Lightning(scene, this),
    ];
    this.currentWeaponIndex = 0;
    this.currentWeapon = this.weapons[this.currentWeaponIndex];
    
    // Input
    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ONE: Phaser.Input.Keyboard.KeyCodes.ONE,
      TWO: Phaser.Input.Keyboard.KeyCodes.TWO,
      THREE: Phaser.Input.Keyboard.KeyCodes.THREE,
      FOUR: Phaser.Input.Keyboard.KeyCodes.FOUR,
      FIVE: Phaser.Input.Keyboard.KeyCodes.FIVE,
      SIX: Phaser.Input.Keyboard.KeyCodes.SIX,
      SEVEN: Phaser.Input.Keyboard.KeyCodes.SEVEN,
    });
    
    // Gamepad support
    this.gamepad = null;
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once('connected', (pad) => {
        this.gamepad = pad;
        console.log('Gamepad connected:', pad.id);
      });
    }
  }

  update(time, delta) {
    if (!this.active) return;
    
    this.handleMovement();
    this.handleShooting(time);
    this.handleWeaponSwitch();
    this.handleDash();
  }

  handleMovement() {
    if (this.isDashing) return;
    
    let velocityX = 0;
    let velocityY = 0;
    
    // Keyboard input
    if (this.keys.A.isDown) velocityX -= 1;
    if (this.keys.D.isDown) velocityX += 1;
    if (this.keys.W.isDown) velocityY -= 1;
    if (this.keys.S.isDown) velocityY += 1;
    
    // Gamepad input
    if (this.gamepad) {
      const leftStick = this.gamepad.leftStick;
      if (Math.abs(leftStick.x) > 0.1) velocityX += leftStick.x;
      if (Math.abs(leftStick.y) > 0.1) velocityY += leftStick.y;
    }
    
    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }
    
    const speed = this.speed * this.speedMultiplier;
    this.setVelocity(velocityX * speed, velocityY * speed);
    
    // Rotate player to face mouse
    const pointer = this.scene.input.activePointer;
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    this.rotation = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
  }

  handleShooting(time) {
    const pointer = this.scene.input.activePointer;
    const isMouseDown = pointer.isDown;
    
    // Gamepad shooting
    let isGamepadShooting = false;
    if (this.gamepad) {
      const rightStick = this.gamepad.rightStick;
      if (Math.abs(rightStick.x) > 0.3 || Math.abs(rightStick.y) > 0.3) {
        isGamepadShooting = true;
        // Aim with right stick
        const angle = Math.atan2(rightStick.y, rightStick.x);
        this.rotation = angle;
      }
    }
    
    if (isMouseDown || isGamepadShooting) {
      this.currentWeapon.fire(time);
    }
  }

  handleWeaponSwitch() {
    const keys = [this.keys.ONE, this.keys.TWO, this.keys.THREE, this.keys.FOUR, 
                  this.keys.FIVE, this.keys.SIX, this.keys.SEVEN];
    
    keys.forEach((key, index) => {
      if (Phaser.Input.Keyboard.JustDown(key) && index < this.weapons.length) {
        this.currentWeaponIndex = index;
        this.currentWeapon = this.weapons[index];
      }
    });
    
    // Gamepad weapon switch (bumpers)
    if (this.gamepad) {
      if (this.gamepad.R1 && !this.lastR1) {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];
      }
      if (this.gamepad.L1 && !this.lastL1) {
        this.currentWeaponIndex = (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];
      }
      this.lastR1 = this.gamepad.R1;
      this.lastL1 = this.gamepad.L1;
    }
  }

  handleDash() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && this.canDash) {
      this.dash();
    }
    
    // Gamepad dash
    if (this.gamepad && this.gamepad.A && !this.lastDashButton && this.canDash) {
      this.dash();
    }
    if (this.gamepad) {
      this.lastDashButton = this.gamepad.A;
    }
  }

  dash() {
    this.canDash = false;
    this.isDashing = true;
    this.invincible = true;
    
    // Dash in current movement direction or forward if stationary
    let dashX = Math.cos(this.rotation);
    let dashY = Math.sin(this.rotation);
    
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      const angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      dashX = Math.cos(angle);
      dashY = Math.sin(angle);
    }
    
    this.setVelocity(dashX * this.dashSpeed, dashY * this.dashSpeed);
    
    // Visual effect
    this.setAlpha(0.5);
    
    // End dash
    this.scene.time.delayedCall(this.dashDuration, () => {
      this.isDashing = false;
      this.setAlpha(1);
      this.setVelocity(0, 0);
    });
    
    // End invincibility
    this.scene.time.delayedCall(PLAYER_CONFIG.invincibilityTime, () => {
      this.invincible = false;
    });
    
    // Cooldown
    const cooldown = this.dashCooldown * (1 - this.dashCooldownReduction);
    this.scene.time.delayedCall(cooldown, () => {
      this.canDash = true;
    });
  }

  takeDamage(amount) {
    if (this.invincible) return;
    
    this.health -= amount;
    this.invincible = true;
    
    // Visual feedback
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(200, 0.01);
    
    this.scene.time.delayedCall(PLAYER_CONFIG.invincibilityTime, () => {
      this.invincible = false;
      this.clearTint();
    });
    
    if (this.health <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  die() {
    this.active = false;
    this.visible = false;
    
    // Create death effect
    const particles = this.scene.add.particles(this.x, this.y, 'player-temp', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 20,
    });
    
    this.scene.time.delayedCall(500, () => particles.destroy());
    
    // Game over
    this.scene.time.delayedCall(1000, () => {
      this.scene.gameOver();
    });
  }

  applyUpgrade(stat, value) {
    if (stat === 'maxHealth') {
      this.maxHealth += value;
      this.health += value;
    } else if (stat === 'damageMultiplier') {
      this.damageMultiplier += value;
    } else if (stat === 'fireRateMultiplier') {
      this.fireRateMultiplier += value;
    } else if (stat === 'speedMultiplier') {
      this.speedMultiplier += value;
    } else if (stat === 'projectileSpeedMultiplier') {
      this.projectileSpeedMultiplier += value;
    } else if (stat === 'piercing') {
      this.piercing = value;
    } else if (stat === 'extraProjectiles') {
      this.extraProjectiles += value;
    } else if (stat === 'lifeSteal') {
      this.lifeSteal += value;
    } else if (stat === 'critChance') {
      this.critChance += value;
    } else if (stat === 'dashCooldownReduction') {
      this.dashCooldownReduction += value;
    }
  }
}

