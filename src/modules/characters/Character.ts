import { gameState } from '../state/GameState';

export default class Character {
  velocity: number;
  initPosition: { x: number; y: number };
  life: number;
  maxMana: number;
  currentMana: number;
  manaRecoverRate: number;

  constructor(velocity: number, initPosition: { x: number; y: number }, life: number, mana = 0, manaRecoverRate = 0) {
    this.velocity = velocity;
    this.initPosition = initPosition;
    this.life = life;
    this.maxMana = mana;
    this.manaRecoverRate = 1000;
    this.currentMana = this.maxMana;
  }

  handleUpdate(time: number, delta: number) {
    if (time % this.manaRecoverRate > gameState().frameDuration) {
      return;
    }

    if (this.currentMana >= this.maxMana) {
      return;
    }

    this.currentMana++;
  }
}
