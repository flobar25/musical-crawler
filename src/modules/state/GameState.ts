import { Scene } from 'phaser';
import MainPlayer from '../characters/MainPlayer';
import Monster from '../characters/Monster';
import Music from '../music/Music';
import TextGenerator from '../text/TextGenerator';

export function gameState() {
  return GameState.getInstance();
}

export function getScene() {
  return GameState.getInstance().scene;
}

export function getPlayer() {
  return GameState.getInstance().player;
}

export function getMonsters() {
  return GameState.getInstance().monsters;
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

  player!: MainPlayer;
  monsters!: Monster[];
  music!: Music;
  textGenerator!: TextGenerator;

  graphics!: Phaser.GameObjects.Graphics;

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
    this.graphics = scene.add.graphics();
    this.graphics.lineStyle(128, 0x00ff00, 1);
  }

  private constructor() {
    // do nothing - singleton
  }
}
