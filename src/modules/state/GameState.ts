import { Scene } from 'phaser';

export function gameState() {
  return GameState.getInstance();
}

export function getScene() {
  return GameState.getInstance().scene;
}

export default class GameState {
  private static instance = new GameState();

  bpm = -1;
  fps = -1;
  quarterNoteDuration = -1;
  halfNoteDuration = -1;
  musicStartTime = -1;
  frameDuration = -1;
  scene!: Scene;

  static getInstance(): GameState {
    return this.instance;
  }

  initState(bpm: number, scene: Scene) {
    this.bpm = bpm;
    this.scene = scene;
    this.fps = scene.physics.world.fps;
    this.quarterNoteDuration = 60000 / this.bpm;
    this.halfNoteDuration = this.quarterNoteDuration * 2;
    this.frameDuration = 1000 / this.fps;
  }

  private constructor() {
    // do nothing - singleton
  }
}
