import { Scene } from 'phaser';
import GameState from '../state/GameState';

export default class Weapon {
  key: string;
  soundFile: string;
  activationTime: number;
  musicResolution: number;

  constructor(soundFile: string, key: string, resolution: number) {
    this.key = key;
    this.soundFile = soundFile;
    this.activationTime = -1;
    this.musicResolution = resolution;
  }

  activate(time?: number) {
    if (time && GameState.getInstance().musicStartTime > 0) {
      this.activationTime = time;
    }
  }

  handleUpdate(time: number, delta: number): boolean {
    const relativeTime = time - GameState.getInstance().musicStartTime;
    if (this.activationTime != -1) {
      const relativeQTime = this.activationTime - GameState.getInstance().musicStartTime;
      const lagTime = relativeQTime % GameState.getInstance().quarterNoteDuration;
      const lagTick = Math.floor(lagTime / (GameState.getInstance().quarterNoteDuration / this.musicResolution));
      const delay = lagTick * (GameState.getInstance().quarterNoteDuration / this.musicResolution);
      // let delay = ((relativeQTime % this.quarterNoteDuration) / (this.musicResolution*this.quarterNoteDuration)) * (this.quarterNoteDuration * this.musicResolution);
      // console.log(delay);

      if (
        (relativeTime - delay) % (GameState.getInstance().quarterNoteDuration / this.musicResolution) <=
        GameState.getInstance().frameDuration
      ) {
        return true;
      }
    }

    return false;
  }
}
