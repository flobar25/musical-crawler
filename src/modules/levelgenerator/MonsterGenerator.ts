import Monster from '../characters/Monster';
import { HEIGHT, WIDTH } from '../constants/Constants';
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
    getScene().load.spritesheet(Monster.SPRITESHEET_KEY, 'assets/sprites/LandmineBot/LandmineBotAllSprites.png', {
      frameWidth: 104,
      frameHeight: 108,
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
    // console.log('adding monsters');

    let leftToAdd = this.monsterIncrement;
    let inactiveMonstersCount = getInactiveMonsters().length;

    while (inactiveMonstersCount > 0 && leftToAdd > 0) {
      // console.log('reusing inactive monster');
      inactiveMonstersCount--;
      leftToAdd--;
      const inactiveMonster = getInactiveMonsters()[inactiveMonstersCount];
      inactiveMonster.sprite.alpha = 1;
      inactiveMonster.life = this.defaultLife;
      const position = this.generateMonsterPosition();
      inactiveMonster.sprite.x = position.x;
      inactiveMonster.sprite.y = position.y;
    }

    while (leftToAdd > 0) {
      // console.log('creating new monster');
      leftToAdd--;
      gameState().monsters.push(new Monster(70, this.generateMonsterPosition(), this.defaultLife));
    }
  }

  generateMonsterPosition() {
    return {
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
    };
  }
}
