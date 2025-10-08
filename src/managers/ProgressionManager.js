export default class ProgressionManager {
  constructor() {
    this.storageKey = 'roguelite-shooter-save';
    this.data = this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      currency: 0,
      runsCompleted: 0,
      bestScore: 0,
      unlocks: [],
      permanentUpgrades: {},
    };
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  addCurrency(amount) {
    this.data.currency += amount;
    this.saveData();
  }

  spendCurrency(amount) {
    if (this.data.currency >= amount) {
      this.data.currency -= amount;
      this.saveData();
      return true;
    }
    return false;
  }

  incrementRuns() {
    this.data.runsCompleted++;
    this.saveData();
  }

  updateBestScore(score) {
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
      this.saveData();
    }
  }

  unlock(id) {
    if (!this.data.unlocks.includes(id)) {
      this.data.unlocks.push(id);
      this.saveData();
    }
  }

  isUnlocked(id) {
    return this.data.unlocks.includes(id);
  }

  addPermanentUpgrade(stat, value) {
    if (!this.data.permanentUpgrades[stat]) {
      this.data.permanentUpgrades[stat] = 0;
    }
    this.data.permanentUpgrades[stat] += value;
    this.saveData();
  }

  getPermanentUpgrade(stat) {
    return this.data.permanentUpgrades[stat] || 0;
  }

  getStats() {
    return {
      currency: this.data.currency,
      runsCompleted: this.data.runsCompleted,
      bestScore: this.data.bestScore,
    };
  }

  reset() {
    this.data = {
      currency: 0,
      runsCompleted: 0,
      bestScore: 0,
      unlocks: [],
      permanentUpgrades: {},
    };
    this.saveData();
  }
}

