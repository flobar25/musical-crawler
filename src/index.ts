import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import IntroScene from './scenes/IntroScene';

new Phaser.Game(
  Object.assign(config, {
    scene: [IntroScene, GameScene],
  })
);
