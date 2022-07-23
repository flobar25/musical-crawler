export default class Character {
  velocity: number;
  initPosition: { x: number; y: number };
  life: number;

  constructor(velocity: number, initPosition: { x: number; y: number }, life: number) {
    this.velocity = velocity;
    this.initPosition = initPosition;
    this.life = life;
  }

  handleUpdate(time: number, delta: number) {
    // do nothing - override in children
  }
}
