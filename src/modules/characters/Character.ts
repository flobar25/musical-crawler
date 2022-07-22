import { Scene } from 'phaser';

export default class Character {
  velocity: number;
  initPosition: { x: number; y: number };

  constructor(velocity: number, initPosition: { x: number; y: number }) {
    this.velocity = velocity;
    this.initPosition = initPosition;
  }

  handleUpdate(time: number, delta: number) {
    // do nothing - override in children
  }
}
