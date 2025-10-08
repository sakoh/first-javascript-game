import { UPGRADE_CONFIGS } from '../config.js';

export default class UpgradeManager {
  constructor(scene) {
    this.scene = scene;
  }

  getRandomUpgrades(count) {
    const availableUpgrades = [...UPGRADE_CONFIGS];
    const selected = [];
    
    for (let i = 0; i < count && availableUpgrades.length > 0; i++) {
      const index = Math.floor(Math.random() * availableUpgrades.length);
      selected.push(availableUpgrades[index]);
      availableUpgrades.splice(index, 1);
    }
    
    return selected;
  }

  applyUpgrade(upgrade) {
    const player = this.scene.registry.get('player');
    if (!player) return;
    
    player.applyUpgrade(upgrade.stat, upgrade.value);
  }
}

