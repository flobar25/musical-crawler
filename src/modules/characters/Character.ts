import { Scene } from 'phaser';

export default class Character {
  velocity: number;

  constructor(velocity: number) {
    this.velocity = velocity;
  }

  handleUpdate(time: number, delta: number) {
    // do nothing - override in children
  }
}
