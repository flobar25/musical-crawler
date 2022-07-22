import Phaser from 'phaser';
import MainPlayer from '../modules/characters/MainPlayer';
import Monster from '../modules/characters/Monster';
import Music from '../modules/music/Music';
import { gameState } from '../modules/state/GameState';

export default class Demo extends Phaser.Scene {
  player: MainPlayer;
  monsters: Monster[];
  music: Music;

  constructor() {
    super('GameScene');
    this.player = new MainPlayer(160, { x: 100, y: 450 });
    this.monsters = [new Monster(70, { x: 200, y: 500 }), new Monster(65, { x: 150, y: 300 })];
    this.music = new Music();
  }

  preload() {
    gameState().initState(109, this);
    this.player.handlePreload();
    this.monsters.forEach((m) => m.handlePreload());
    this.music.handlePreload();
  }

  create() {
    this.player.handleCreate();
    this.monsters.forEach((m) => m.handleCreate(this.player.sprite));
    this.music.handleCreate();
    this.sound.pauseOnBlur = false;
  }

  update(time: number, delta: number): void {
    this.music.handleUpdate(time, delta);
    this.player.handleUpdate(time, delta);
    this.monsters.forEach((m) => m.handleUpdate(time, delta));
  }
}
