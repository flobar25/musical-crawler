import GameState, { gameState } from '../state/GameState';

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
    if (time && gameState().musicStartTime > 0) {
      this.activationTime = time;
    }
  }

  handleUpdate(time: number, delta: number): boolean {
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
}
