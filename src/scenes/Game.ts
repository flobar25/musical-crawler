import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.spritesheet('player', 'assets/personajes-lanto.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // const logo = this.add.image(400, 70, 'logo');

    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 24, end: 26 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 36, end: 38 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update(time: number, delta: number): void {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.setVelocityY(0);
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.setVelocityY(0);
        this.player.anims.play('right', true);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      this.player.setVelocityX(0);
      this.player.anims.play('down', true);
    }
    else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.setVelocityX(0);
      this.player.anims.play('up', true);
    }    
    else {
        this.player.anims.play('idle', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-500);
    }
  }
}
