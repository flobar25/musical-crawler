import Phaser from 'phaser';
import MainPlayer from '../modules/characters/MainPlayer';
import Monster from '../modules/characters/Monster';
import Music from '../modules/music/Music';
import { gameState } from '../modules/state/GameState';

export default class Demo extends Phaser.Scene {
  player: MainPlayer;
  monster: Monster;
  music: Music;

  constructor() {
    super('GameScene');
    this.player = new MainPlayer(160, { x: 100, y: 450 });
    this.monster = new Monster(70, { x: 200, y: 500 });
    this.music = new Music();
  }

  preload() {
    gameState().initState(109, this);
    this.player.handlePreload();
    this.monster.handlePreload();
    this.music.handlePreload();
  }

  create() {
    this.player.handleCreate();
    this.monster.handleCreate(this.player.sprite);
    this.music.handleCreate();
    this.sound.pauseOnBlur = false;
  }

  update(time: number, delta: number): void {
    this.music.handleUpdate(time, delta);
    this.player.handleUpdate(time, delta);
    this.monster.handleUpdate(time, delta);
  }
}
