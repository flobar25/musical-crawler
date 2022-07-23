import Monster from '../characters/Monster';
import { getScene } from '../state/GameState';

const ENEMY_DAMAGE = 'enemyDamage';
const DAMAGE_TXT_TTL = 1000;
const DAMAGE_TXT_MAX_COUNT = 25;

export default class TextGenerator {
  damages: { time: number; txt: Phaser.GameObjects.BitmapText }[];

  constructor() {
    this.damages = [];
  }

  handlePreload() {
    getScene().load.bitmapFont(ENEMY_DAMAGE, 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }

  handleCreate() {
    for (let i = 0; i < DAMAGE_TXT_MAX_COUNT; i++) {
      this.damages.push({ time: -1, txt: getScene().add.bitmapText(0, 0, ENEMY_DAMAGE, '0') });
    }
  }

  handleUpdate(time: number, delta: number) {
    // TODO optimize, does not need to render on each frame
    this.damages.forEach((d) => {
      if (d.time + DAMAGE_TXT_TTL < time) {
        if (d.txt.alpha > 0) {
          d.txt.alpha -= 0.05;
        }
      }
    });
  }

  enemyDamage(time: number, damage: number, monster: Monster) {
    const damageToReplace = this.damages.reduce((a, b) => (a.time < b.time ? a : b));

    damageToReplace.time = time;
    damageToReplace.txt.x = monster.sprite.x - 10;
    damageToReplace.txt.y = monster.sprite.y - 50;
    damageToReplace.txt.text = damage.toString();
    damageToReplace.txt.alpha = 1;
  }
}
