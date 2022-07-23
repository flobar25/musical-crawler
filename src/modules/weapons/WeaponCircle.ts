import { gameState, getActiveMonsters, getPlayer, getScene } from '../state/GameState';
import BaseWeapon from './BaseWeapon';

export default class WeaponCircle extends BaseWeapon {
  size: number;
  circle: Phaser.GameObjects.Arc;

  constructor(soundFile: string, key: string, resolution: number, damage: number, cost: number) {
    super(soundFile, key, resolution, damage, cost);
    this.size = 240;
    this.circle = getScene().add.circle(0, 0, this.size, 0xffffff, 0.5).setOrigin(0);
  }

  handleUpdate(time: number, delta: number): boolean {
    this.handleCircle();
    const attacked = this.handleAttack(time, delta);
    if (attacked) {
      this.getTargetedMonsters().forEach((m) => {
        this.dealDamage(time, this.damage, m);
      });
    }
    return attacked;
  }

  handleCircle() {
    this.circle.x = getPlayer().sprite.x - this.size;
    this.circle.y = getPlayer().sprite.y - this.size;
  }

  getTargetedMonsters() {
    return getActiveMonsters().filter((m) => {
      return (
        (m.sprite.x - this.circle.x - this.size) * (m.sprite.x - this.circle.x - this.size) +
          (m.sprite.y - this.circle.y - this.size) * (m.sprite.y - this.circle.y - this.size) <
        this.circle.radius * this.circle.radius
      );
    });
  }
}
