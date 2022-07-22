import { getScene } from '../state/GameState';
import Character from './Character';

export default class Monster extends Character {
  // constants
  static SPRITESHEET_KEY = 'MONSTER_SPRITESHEET_KEY';
  static MONSTER_LEFT_ANIM_KEY = 'MONSTER_LEFT_ANIM';
  static MONSTER_RIGHT_ANIM_KEY = 'MONSTER_RIGHT_ANIM';
  static MONSTER_DOWN_ANIM_KEY = 'MONSTER_DOWN_ANIM';
  static MONSTER_UP_ANIM_KEY = 'MONSTER_UP_ANIM';

  // sprite
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  targetSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  handlePreload() {
    getScene().load.spritesheet(Monster.SPRITESHEET_KEY, 'assets/personajes-lanto.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  handleCreate(targetSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.sprite = getScene().physics.add.sprite(this.initPosition.x, this.initPosition.y, Monster.SPRITESHEET_KEY);
    this.createMonsterAnims();
    this.targetSprite = targetSprite;
  }

  handleUpdate(time: number, delta: number): void {
    this.handleMonsterMoves();
  }

  private handleMonsterMoves() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.targetSprite.x < this.sprite.x) {
      velocityX = -this.velocity;
    } else if (this.targetSprite.x > this.sprite.x) {
      velocityX = this.velocity;
    } else {
      velocityX = 0;
    }

    if (this.targetSprite.y < this.sprite.y) {
      velocityY = -this.velocity;
    } else if (this.targetSprite.y > this.sprite.y) {
      velocityY = this.velocity;
    } else {
      velocityY = 0;
    }

    if (velocityX < 0) {
      this.sprite.anims.play(Monster.MONSTER_LEFT_ANIM_KEY, true);
    } else if (velocityX > 0) {
      this.sprite.anims.play(Monster.MONSTER_RIGHT_ANIM_KEY, true);
    } else if (velocityY > 0) {
      this.sprite.anims.play(Monster.MONSTER_UP_ANIM_KEY, true);
    } else if (velocityY < 0) {
      this.sprite.anims.play(Monster.MONSTER_DOWN_ANIM_KEY, true);
    } else {
      this.sprite.anims.play('idle', true);
    }

    this.sprite.setVelocityX(velocityX);
    this.sprite.setVelocityY(velocityY);
  }

  private createMonsterAnims() {
    const scene = getScene();
    scene.anims.create({
      key: Monster.MONSTER_LEFT_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 15, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: Monster.MONSTER_RIGHT_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 27, end: 29 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: Monster.MONSTER_UP_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 39, end: 41 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: Monster.MONSTER_DOWN_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 2, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
