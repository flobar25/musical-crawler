import Phaser from 'phaser';
import { HEIGHT, WIDTH } from './modules/constants/Constants';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: WIDTH,
    height: HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 300 },
      debug: true,
    },
  },
  render: {
    pixelArt: true,
  },
};
