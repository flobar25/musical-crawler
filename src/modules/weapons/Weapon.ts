import { Scene } from 'phaser';

export default class Weapon {
  scene: Scene;
  key: string;
  soundFile: string;
  bpm: number;
  quarterNoteDuration: number;
  frameDuration: number;
  activationTime: number;
  musicStartTime: number;
  musicResolution: number;

  constructor(scene: Scene, soundFile: string, key: string, bpm: number, fps: number, resolution: number) {
    this.scene = scene;
    this.key = key;
    this.soundFile = soundFile;
    this.bpm = bpm;
    this.quarterNoteDuration = 60000 / this.bpm;
    this.frameDuration = 1000 / fps;
    this.activationTime = -1;
    this.musicStartTime = -1;
    this.musicResolution = resolution;
  }

  activate(time?: number, musicStartTime?: number) {
    if (time && musicStartTime) {
      this.activationTime = time;
      this.musicStartTime = musicStartTime;
    }
  }

  handleUpdate(time: number, delta: number): boolean {
    const relativeTime = time - this.musicStartTime;

    if (this.activationTime != -1) {
      const relativeQTime = this.activationTime - this.musicStartTime;
      const lagTime = relativeQTime % this.quarterNoteDuration;
      const lagTick = Math.floor(lagTime / (this.quarterNoteDuration / this.musicResolution));
      const delay = lagTick * (this.quarterNoteDuration / this.musicResolution);
      // let delay = ((relativeQTime % this.quarterNoteDuration) / (this.musicResolution*this.quarterNoteDuration)) * (this.quarterNoteDuration * this.musicResolution);
      console.log(delay);

      if ((relativeTime - delay) % (this.quarterNoteDuration / this.musicResolution) <= this.frameDuration) {
        return true;
      }
    }

    return false;
  }
}
