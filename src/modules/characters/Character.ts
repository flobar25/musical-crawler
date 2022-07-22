import { Scene } from 'phaser';

export default class Character {
  scene: Scene;
  velocity: number;
  musicStartTime!: number;

  constructor(scene: Scene, velocity: number) {
    this.scene = scene;
    this.velocity = velocity;
  }

  handleUpdate(time: number, delta: number) {
    // do nothing - override in children
  }
}
