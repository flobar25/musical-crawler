import { Scene } from 'phaser';

export default class KeyboardState {
  // keyboard state
  times: Map<string, number>;
  keys: Map<string, Phaser.Input.Keyboard.Key>;
  qKey!: Phaser.Input.Keyboard.Key;
  wKey!: Phaser.Input.Keyboard.Key;
  eKey!: Phaser.Input.Keyboard.Key;
  scene: Scene;

  constructor(scene: Scene) {
    this.times = new Map();
    this.times.set('q', -1);
    this.times.set('w', -1);
    this.times.set('e', -1);
    this.keys = new Map();
    this.scene = scene;
  }

  preload() {}

  create() {
    this.keys.set('q', this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q));
    this.keys.set('w', this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
    this.keys.set('e', this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E));
  }

  update(time: number, delta: number) {
    this.times.forEach((v, k) => {
      if (v === -1 && this.keys.get(k)?.isDown) {
        this.times.set(k, time);
      } else if (this.keys.get(k)?.isUp) {
        this.times.set(k, -1);
      }
    });
  }
}
