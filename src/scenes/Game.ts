import Phaser from 'phaser';
import MainPlayer from '../modules/characters/MainPlayer';
import Monster from '../modules/characters/Monster';
import { gameState } from '../modules/state/GameState';

const DRUMS = 'drums';

export default class Demo extends Phaser.Scene {
  player: MainPlayer;
  monster: Monster;
  drums!: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');
    this.player = new MainPlayer(160, { x: 100, y: 450 });
    this.monster = new Monster(70, { x: 200, y: 500 });
  }

  preload() {
    gameState().initState(109, this);
    this.player.handlePreload();
    this.monster.handlePreload();
    this.load.audio(DRUMS, 'assets/music/OLIVER_hat_drum_loop_ride_clap_109.wav');
  }

  create() {
    this.player.handleCreate();
    this.monster.handleCreate(this.player.sprite);

    // sound
    this.drums = this.sound.add(DRUMS);
    this.sound.pauseOnBlur = false;
  }

  update(time: number, delta: number): void {
    this.handleMusic(time);
    this.player.handleUpdate(time, delta);
    this.monster.handleUpdate(time, delta);
  }

  private handleMusic(time: number) {
    if (gameState().musicStartTime > -1) {
      return;
    }

    this.drums.play('', { loop: true });
    gameState().musicStartTime = time;
  }
}
