import { gameState, getScene } from '../state/GameState';

export default class Music {
  static DRUMS = 'DRUMS';

  drums!: Phaser.Sound.BaseSound;

  handlePreload() {
    getScene().load.audio(Music.DRUMS, 'assets/music/OLIVER_hat_drum_loop_ride_clap_109.wav');
  }

  handleCreate() {
    this.drums = getScene().sound.add(Music.DRUMS);
  }

  handleUpdate(time: number, delta: number) {
    if (gameState().musicStartTime > -1) {
      return;
    }

    this.drums.play('', { loop: true });
    gameState().musicStartTime = time;
  }
}
