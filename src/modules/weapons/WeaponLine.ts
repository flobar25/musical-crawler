import Monster from '../characters/Monster';
import { gameState, getActiveMonsters, getScene } from '../state/GameState';
import BaseWeapon from './BaseWeapon';

export default class WeaponLine extends BaseWeapon {
  lines: Phaser.GameObjects.Line[];
  targetedEnnemies: Monster[];
  count: number;

  constructor(soundFile: string, key: string, resolution: number, damage: number, cost: number, mana: number) {
    super(soundFile, key, resolution, damage, cost, mana);
    this.count = 2;
    this.lines = [];
    this.targetedEnnemies = [];
  }

  handleUpdate(time: number, delta: number): boolean {
    this.handleLines();
    const attacked = this.handleAttack(time, delta);
    if (attacked) {
      this.targetedEnnemies.forEach((m) => {
        this.dealDamage(time, this.damage, m);
      });
    }
    return attacked;
  }

  handleAttack(time: number, delta: number): boolean {
    if (this.targetedEnnemies.length == 0) {
      return false;
    }

    return super.handleAttack(time, delta);
  }

  handleLines() {
    this.targetedEnnemies = this.getClosestMonsters(this.count);
    if (this.targetedEnnemies.length == 0) {
      this.lines.forEach((l) => (l.alpha = 0));
    }
    // TODO we could avoid doing that on each frame (once every 10 frames or so?)
    this.targetedEnnemies.forEach((m, idx) => {
      if (this.lines.length < idx + 1) {
        this.lines.push(getScene().add.line(0, 0, 0, 0, 100, 100, 0xffffff, 0.5).setOrigin(0));
      }
      const line = this.lines[idx];
      line.setTo(gameState().player.sprite.x, gameState().player.sprite.y, m.sprite.x, m.sprite.y);
      line.alpha = 0.5;
    });
  }

  getClosestMonsters(count: number) {
    const sortedMonsters = getActiveMonsters().sort((a, b) => {
      return (
        Math.sqrt(
          (gameState().player.sprite.x - a.sprite.x) * (gameState().player.sprite.x - a.sprite.x) +
            (gameState().player.sprite.y - a.sprite.y) * (gameState().player.sprite.y - a.sprite.y)
        ) -
        Math.sqrt(
          (gameState().player.sprite.x - b.sprite.x) * (gameState().player.sprite.x - b.sprite.x) +
            (gameState().player.sprite.y - b.sprite.y) * (gameState().player.sprite.y - b.sprite.y)
        )
      );
    });

    const result = sortedMonsters.slice(0, count);
    return result;
  }
}
