import { getPlayer, getScene } from '../state/GameState';
import Character from './Character';

export default class Monster extends Character {
  // constants
  static SPRITESHEET_KEY = 'MONSTER_SPRITESHEET_KEY';
  static MONSTER_MOVE_ANIM_KEY = 'MONSTER_MOVE_ANIM';
  static MONSTER_DEATH_ANIM_KEY = 'MONSTER_DEATH_ANIM';

  // sprite
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  targetSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  handlePreload() {}

  handleCreate() {}

  handleUpdate(time: number, delta: number): void {
    if (this.life <= 0) {
      return;
    }
    super.handleUpdate(time, delta);
    if (this.sprite === undefined) {
      this.sprite = getScene().physics.add.sprite(this.initPosition.x, this.initPosition.y, Monster.SPRITESHEET_KEY);
      this.sprite.setScale(2);
      this.createMonsterAnims();
      this.targetSprite = getPlayer().sprite;
    }

    this.handleMonsterMoves();
  }

  private handleMonsterMoves() {
    if (this.life <= 0) {
      return;
    }

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
      this.sprite.anims.play(Monster.MONSTER_MOVE_ANIM_KEY, true);
      this.sprite.setFlipX(false);
    } else if (velocityX > 0) {
      this.sprite.anims.play(Monster.MONSTER_MOVE_ANIM_KEY, true);
      this.sprite.setFlipX(true);
    } else if (velocityY > 0) {
      this.sprite.anims.play(Monster.MONSTER_MOVE_ANIM_KEY, true);
    } else if (velocityY < 0) {
      this.sprite.anims.play(Monster.MONSTER_MOVE_ANIM_KEY, true);
    } else {
      this.sprite.anims.play('idle', true);
    }

    this.sprite.setVelocityX(velocityX);
    this.sprite.setVelocityY(velocityY);
  }

  damageReceived(time: number, damage: number) {
    this.life -= damage;
    if (this.life <= 0) {
      this.sprite.anims.play(Monster.MONSTER_DEATH_ANIM_KEY, true);
    }
  }

  private createMonsterAnims() {
    const scene = getScene();
    scene.anims.create({
      key: Monster.MONSTER_MOVE_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: Monster.MONSTER_DEATH_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(Monster.SPRITESHEET_KEY, { start: 16, end: 23 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
