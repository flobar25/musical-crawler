export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }
  preload() {
    this.load.image('splashscreen', 'assets/images/splashscreen.png');
    this.load.bitmapFont('splashfont', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }

  create() {
    const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enter.on('down', () => {
      this.scene.start('GameScene');
    });
    this.add.image(0, 0, 'splashscreen').setScale(0.65).setOrigin(0);
    this.add.bitmapText(100, 100, 'splashfont', 'Press Enter! \n TODO: explain how to play the game');
  }
}
