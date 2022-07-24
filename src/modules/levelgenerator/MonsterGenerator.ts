import Monster from '../characters/Monster';
import { gameState, getActiveMonsters, getInactiveMonsters, getScene } from '../state/GameState';

export default class MonsterGenerator {
  maxMonster: number;
  monsterIncrement: number;
  monsterRate: number;
  defaultLife: number;

  constructor(maxMonster: number, monsterIncrement: number, monsterRate: number, defaultLife: number) {
    this.maxMonster = maxMonster;
    this.monsterIncrement = monsterIncrement;
    this.monsterRate = monsterRate;
    this.defaultLife = defaultLife;
  }

  handlePreload() {
    getScene().load.spritesheet(Monster.SPRITESHEET_KEY, 'assets/personajes-lanto.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  handleCreate() {}

  handleUpdate(time: number, delta: number) {
    if (time % this.monsterRate > gameState().frameDuration) {
      return;
    }

    if (getActiveMonsters().length >= this.maxMonster) {
      return;
    }

    console.log('adding monsters');

    let leftToAdd = this.monsterIncrement;
    let inactiveMonstersCount = getInactiveMonsters().length;

    while (inactiveMonstersCount > 0 && leftToAdd > 0) {
      console.log('reusing inactive monster');
      inactiveMonstersCount--;
      leftToAdd--;
      const inactiveMonster = getInactiveMonsters()[inactiveMonstersCount];
      inactiveMonster.sprite.alpha = 1;
      inactiveMonster.life = this.defaultLife;
      inactiveMonster.sprite.x = 200;
      inactiveMonster.sprite.y = 500;
    }

    while (leftToAdd > 0) {
      console.log('creating new monster');
      leftToAdd--;
      gameState().monsters.push(new Monster(70, { x: 200, y: 500 }, this.defaultLife));
    }
  }
}
