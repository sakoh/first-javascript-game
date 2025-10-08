import Weapon from '../entities/Weapon.js';
import { WEAPON_CONFIGS } from '../config.js';

export default class SMG extends Weapon {
  constructor(scene, player) {
    super(scene, player, WEAPON_CONFIGS.smg);
  }
}

