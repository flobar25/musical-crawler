import { gameState } from '../state/GameState';

export default class Character {
  velocity: number;
  initPosition: { x: number; y: number };
  life: number;
  manaRecoverRate: number;

  constructor(velocity: number, initPosition: { x: number; y: number }, life: number, manaRecoverRate = 0) {
    this.velocity = velocity;
    this.initPosition = initPosition;
    this.life = life;
    this.manaRecoverRate = manaRecoverRate;
  }

  handleUpdate(time: number, delta: number) {}
}
