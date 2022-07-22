import { Scene } from 'phaser';

export default class GameState {
  bpm = -1;
  quarterNoteDuration = -1;
  halfNoteDuration = -1;
  musicStartTime = -1;
  frameDuration = -1;
  private static instance = new GameState();

  static getInstance() {
    return this.instance;
  }

  initBpm(bpm: number, scene: Scene) {
    this.bpm = bpm;
    this.quarterNoteDuration = 60000 / this.bpm;
    this.halfNoteDuration = this.quarterNoteDuration * 2;
    this.frameDuration = 1000 / scene.physics.world.fps;
  }

  private constructor() {
    // do nothing - singleton
  }
}
