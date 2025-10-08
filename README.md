# Roguelite Twin-Stick Shooter

A full-featured roguelite twin-stick shooter built with Phaser 3 and JavaScript, playable directly in the browser.

## Features

### Core Gameplay
- **Twin-stick controls**: WASD for movement, mouse for aiming and shooting
- **7 unique weapons**: Pistol, SMG, Shotgun, Sniper Rifle, Laser Rifle, Rocket Launcher, Lightning Gun
- **6+ enemy types**: Chasers, Shooters, Tanks, Splitters, Teleporters, Spawners
- **Boss encounters**: Phase-based bosses with unique attack patterns
- **Procedural generation**: Randomly generated rooms with obstacles and hazards

### Progression Systems
- **Run-based upgrades**: Choose from 3 upgrades after clearing each room
- **Meta-progression**: Earn currency to unlock permanent upgrades between runs
- **Multiple biomes**: Facility, Caves, Factory, and Void with unique aesthetics and enemy pools
- **Difficulty scaling**: Enemies get tougher as you progress through rooms

### Weapons

1. **Pistol** - Balanced starter weapon with infinite ammo
2. **SMG** - Rapid fire with spray pattern
3. **Shotgun** - Close-range devastation with multi-pellet spread
4. **Sniper Rifle** - High damage, piercing shots
5. **Laser Rifle** - Continuous piercing beam
6. **Rocket Launcher** - Explosive area-of-effect damage
7. **Lightning Gun** - Chains damage between enemies

### Controls

**Keyboard & Mouse**:
- WASD: Movement
- Mouse: Aim and shoot
- 1-7: Switch weapons
- Space: Dash (with cooldown)

**Gamepad** (if connected):
- Left stick: Movement
- Right stick: Aim and shoot
- L1/R1: Switch weapons
- A button: Dash

### Upgrades

- Max Health increase
- Damage boost
- Fire rate increase
- Movement speed boost
- Projectile speed boost
- Piercing shots
- Extra projectiles
- Life steal
- Critical hit chance
- Dash cooldown reduction

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Performance Optimizations

- **Object pooling** for projectiles and particles
- **Spatial partitioning** for efficient collision detection
- **Camera culling** to only render visible objects
- **Texture atlases** for efficient sprite rendering
- **Optimized physics** with Phaser's Arcade Physics

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 Modules
- WebGL (fallback to Canvas2D)

Optimized for desktop and capable devices. Mobile/touch support included via virtual joysticks.

## Project Structure

```
first-javascript-game/
├── index.html              # Entry point
├── package.json           # Dependencies
├── vite.config.js         # Build configuration
├── src/
│   ├── main.js           # Phaser game initialization
│   ├── config.js         # Game configuration and constants
│   ├── scenes/           # Game scenes
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── UIScene.js
│   │   ├── UpgradeScene.js
│   │   └── GameOverScene.js
│   ├── entities/         # Game entities
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   ├── Weapon.js
│   │   └── Pickup.js
│   ├── weapons/          # Weapon implementations
│   │   ├── Pistol.js
│   │   ├── SMG.js
│   │   ├── Shotgun.js
│   │   ├── Sniper.js
│   │   ├── Laser.js
│   │   ├── Rocket.js
│   │   └── Lightning.js
│   └── managers/         # Game systems
│       ├── LevelManager.js
│       ├── EnemyManager.js
│       ├── UpgradeManager.js
│       ├── ProgressionManager.js
│       └── PoolManager.js
```

## Technologies Used

- **Phaser 3**: Game framework
- **Vite**: Build tool and dev server
- **JavaScript ES6+**: Modern JavaScript features
- **HTML5 Canvas**: Rendering
- **LocalStorage**: Save data persistence

## Game Design

This roguelite twin-stick shooter emphasizes:
- Fast-paced action gameplay
- Strategic weapon selection and switching
- Risk/reward decision making in upgrade choices
- Replayability through procedural generation and meta-progression
- Satisfying combat with visual and audio feedback

## Future Enhancements

Potential additions:
- Pixel art sprite replacements for placeholder graphics
- Sound effects and music
- Additional biomes and bosses
- More enemy types and variants
- Expanded meta-progression system
- Achievement system
- Leaderboards
- Additional special abilities
- Co-op multiplayer

## License

This project is open source and available for educational purposes.

