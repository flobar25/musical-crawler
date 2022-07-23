import Monster from '../characters/Monster';
import { gameState, getActiveMonsters } from '../state/GameState';

export default abstract class BaseWeapon {
  key: string;
  soundFile: string;
  activationTime: number;
  musicResolution: number;
  damage: number;
  cost: number;

  constructor(soundFile: string, key: string, resolution: number, damage: number, cost: number) {
    this.key = key;
    this.soundFile = soundFile;
    this.activationTime = -1;
    this.musicResolution = resolution;
    this.damage = damage;
    this.cost = cost;
  }

  abstract handleUpdate(time: number, delta: number): boolean;

  activate(time?: number) {
    if (time && gameState().musicStartTime > 0) {
      this.activationTime = time;
    }
  }

  handleAttack(time: number, delta: number): boolean {
    const relativeTime = time - gameState().musicStartTime;
    if (this.activationTime != -1) {
      const relativeQTime = this.activationTime - gameState().musicStartTime;
      const lagTime = relativeQTime % gameState().quarterNoteDuration;
      const lagTick = Math.floor(lagTime / (gameState().quarterNoteDuration / this.musicResolution));
      const delay = lagTick * (gameState().quarterNoteDuration / this.musicResolution);
      // let delay = ((relativeQTime % this.quarterNoteDuration) / (this.musicResolution*this.quarterNoteDuration)) * (this.quarterNoteDuration * this.musicResolution);
      // console.log(delay);

      if (
        (relativeTime - delay) % (gameState().quarterNoteDuration / this.musicResolution) <=
        gameState().frameDuration
      ) {
        return true;
      }
    }

    return false;
  }

  dealDamage(time: number, damage: number, monster: Monster) {
    gameState().textGenerator.enemyDamage(time, this.damage, monster);
    monster.life -= damage;
    if (monster.life <= 0) {
      monster.sprite.alpha = 0;
    }
  }
}
