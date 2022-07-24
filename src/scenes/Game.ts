import Phaser from 'phaser';
import MainPlayer from '../modules/characters/MainPlayer';
import MonsterGenerator from '../modules/levelgenerator/MonsterGenerator';
import Music from '../modules/music/Music';
import { gameState } from '../modules/state/GameState';
import TextGenerator from '../modules/text/TextGenerator';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
    gameState().player = new MainPlayer(200, { x: 100, y: 450 }, 1000);
    // gameState().monsters = [
    //   new Monster(70, { x: 200, y: 500 }, 50),
    //   new Monster(65, { x: 150, y: 300 }, 50),
    //   new Monster(65, { x: 800, y: 800 }, 50),
    //   new Monster(65, { x: 400, y: 800 }, 50),
    // ];
    gameState().monsterGenerator = new MonsterGenerator(1000, 1, 500, 100);
    gameState().music = new Music();
    gameState().textGenerator = new TextGenerator();
  }

  preload() {
    gameState().initState(109, this);
    gameState().player.handlePreload();
    gameState().monsterGenerator.handlePreload();
    gameState().monsters.forEach((m) => m.handlePreload());
    gameState().music.handlePreload();
    gameState().textGenerator.handlePreload();
  }

  create() {
    gameState().player.handleCreate();
    gameState().monsterGenerator.handleCreate();
    gameState().monsters.forEach((m) => m.handleCreate(gameState().player.sprite));
    gameState().music.handleCreate();
    gameState().textGenerator.handleCreate();
    this.sound.pauseOnBlur = false;
  }

  update(time: number, delta: number): void {
    gameState().music.handleUpdate(time, delta);
    gameState().player.handleUpdate(time, delta);
    gameState().monsterGenerator.handleUpdate(time, delta);
    gameState().monsters.forEach((m) => m.handleUpdate(time, delta));
    gameState().textGenerator.handleUpdate(time, delta);
  }
}
