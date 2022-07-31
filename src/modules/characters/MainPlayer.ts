import { gameState, getScene } from '../state/GameState';
import BaseWeapon from '../weapons/BaseWeapon';
import WeaponCircle from '../weapons/WeaponCircle';
import WeaponLine from '../weapons/WeaponLine';
import Character from './Character';

export default class MainPlayer extends Character {
  // constants
  static PLAYER_SPRITE = 'PLAYER_SPRITE';
  static IDLE_ANIM_KEY = 'IDLE_ANIM';
  static RUN_ANIM_KEY = 'RUN_ANIM';
  static SHOT_ANIM_KEY = 'SHOT_ANIM';
  static HIT_ANIM_KEY = 'HIT_ANIM';
  static ATTACK_ANIM_KEY = 'ATTACK_ANIM';
  static DEATH_ANIM_KEY = 'DEATH_ANIM';

  // keyboard
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: Map<string, Phaser.Input.Keyboard.Key>;
  times!: Map<string, number>;
  weapons!: Map<string, BaseWeapon>;

  // sprite
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  handlePreload() {
    // getScene().load.spritesheet(MainPlayer.RUN_SPRITESHEET_KEY, 'assets/personajes-lanto.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // getScene().load.spritesheet(MainPlayer.RUN_SPRITESHEET_KEY, 'assets/hld.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // getScene().load.spritesheet(
    //   MainPlayer.RIGHT_RUN_SPRITESHEET_KEY,
    //   'assets/sprites/ShotgunnerResized/Original/run.png',
    //   {
    //     frameWidth: 32,
    //     frameHeight: 35,

    //   }
    // );

    // getScene().load.spritesheet(
    //   MainPlayer.LEFT_RUN_SPRITESHEET_KEY,
    //   'assets/sprites/ShotgunnerResized/Mirror/run_left.png',
    //   {
    //     frameWidth: 32,
    //     frameHeight: 35,
    //   }
    // );

    getScene().load.spritesheet(MainPlayer.PLAYER_SPRITE, 'assets/sprites/Shotgunner/ShotgunnerAllSprites.png', {
      frameWidth: 192,
      frameHeight: 192,
    });

    this.weapons = new Map();
    this.weapons.set('q', new WeaponLine('assets/music/beep1.wav', 'qsound', 2, 5, 1, 50));
    this.weapons.set('w', new WeaponCircle('assets/music/wah.wav', 'wsound', 1, 10, 10, 10));
    this.weapons.forEach((w) => getScene().load.audio(w.key, w.soundFile));
  }

  handleCreate() {
    this.cursors = getScene().input.keyboard.createCursorKeys();
    this.times = new Map();
    this.times.set('q', -1);
    this.times.set('w', -1);
    this.times.set('e', -1);
    this.keys = new Map();
    this.keys.set('q', getScene().input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q));
    this.keys.set('w', getScene().input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
    this.keys.set('e', getScene().input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E));
    this.sprite = getScene().physics.add.sprite(this.initPosition.x, this.initPosition.y, MainPlayer.PLAYER_SPRITE);
    this.sprite.setBodySize(32, 32, true);
    this.sprite.scale = 2;

    this.createPlayerAnims();
  }

  handleUpdate(time: number, delta: number): void {
    super.handleUpdate(time, delta);
    this.handlePlayerMove();
    this.handleKeys(time);
    this.handleWeapons(time, delta);
    this.handleWeaponMana(time, delta);
  }

  handleWeaponMana(time: number, delta: number) {
    if (time % this.manaRecoverRate > gameState().frameDuration) {
      return;
    }

    this.weapons.forEach((w) => {
      if (w.currentMana >= w.maxMana) {
        return;
      }
      w.currentMana++;
    });
  }

  handlePlayerMove(): void {
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-this.velocity);
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(this.velocity);
    } else if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
      this.sprite.setVelocityX(0);
    }

    if (this.cursors.down.isDown) {
      this.sprite.setVelocityY(this.velocity);
    } else if (this.cursors.up.isDown) {
      this.sprite.setVelocityY(-this.velocity);
    } else if (!this.cursors.down.isDown && !this.cursors.up.isDown) {
      this.sprite.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.sprite.anims.play(MainPlayer.RUN_ANIM_KEY, true);
      this.sprite.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.sprite.anims.play(MainPlayer.RUN_ANIM_KEY, true);
      this.sprite.setFlipX(false);
    } else if (this.cursors.down.isDown) {
      this.sprite.anims.play(MainPlayer.RUN_ANIM_KEY, true);
    } else if (this.cursors.up.isDown) {
      this.sprite.anims.play(MainPlayer.RUN_ANIM_KEY, true);
    } else {
      this.sprite.anims.play(MainPlayer.IDLE_ANIM_KEY, true);
    }
  }

  handleKeys(time: number) {
    this.times.forEach((v, k) => {
      if (v === -1 && this.keys.get(k)?.isDown) {
        this.times.set(k, time);
      } else if (this.keys.get(k)?.isUp) {
        this.times.set(k, -1);
      }
    });
  }

  handleWeapons(time: number, delta: number) {
    this.weapons.forEach((w, k) => {
      w.activate(this.times.get(k));
      if (w.handleUpdate(time, delta)) {
        getScene().sound.play(w.key);
      }
    });
  }

  private createPlayerAnims() {
    getScene().anims.create({
      key: MainPlayer.IDLE_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
        start: 0,
        end: 6,
      }),
      frameRate: 15,
      repeat: -1,
    });

    getScene().anims.create({
      key: MainPlayer.RUN_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
        start: 7,
        end: 14,
      }),
      frameRate: 15,
      repeat: -1,
    });

    // getScene().anims.create({
    //   key: MainPlayer.SHOT_ANIM_KEY,
    //   frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
    //     start: 15,
    //     end: 20,
    //   }),
    //   frameRate: 15,
    //   repeat: -1,
    // });

    // getScene().anims.create({
    //   key: MainPlayer.HIT_ANIM_KEY,
    //   frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
    //     start: 21,
    //     end: 22,
    //   }),
    //   frameRate: 15,
    //   repeat: -1,
    // });

    // getScene().anims.create({
    //   key: MainPlayer.ATTACK_ANIM_KEY,
    //   frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
    //     start: 23,
    //     end: 28,
    //   }),
    //   frameRate: 15,
    //   repeat: -1,
    // });

    // getScene().anims.create({
    //   key: MainPlayer.DEATH_ANIM_KEY,
    //   frames: getScene().anims.generateFrameNumbers(MainPlayer.PLAYER_SPRITE, {
    //     start: 29,
    //     end: 39,
    //   }),
    //   frameRate: 15,
    //   repeat: -1,
    // });
  }
}
