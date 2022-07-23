import { getScene } from '../state/GameState';
import WeaponLine from '../weapons/WeaponLine';
import Character from './Character';

export default class MainPlayer extends Character {
  // constants
  static SPRITESHEET_KEY = 'PLAYER_SPRITESHEET_KEY';
  static PLAYER_LEFT_ANIM_KEY = 'PLAYER_LEFT_ANIM';
  static PLAYER_RIGHT_ANIM_KEY = 'PLAYER_RIGHT_ANIM';
  static PLAYER_DOWN_ANIM_KEY = 'PLAYER_DOWN_ANIM';
  static PLAYER_UP_ANIM_KEY = 'PLAYER_UP_ANIM';

  // keyboard
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: Map<string, Phaser.Input.Keyboard.Key>;
  times!: Map<string, number>;
  weapons!: Map<string, WeaponLine>;

  // sprite
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  handlePreload() {
    // getScene().load.spritesheet(MainPlayer.SPRITESHEET_KEY, 'assets/personajes-lanto.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    getScene().load.spritesheet(MainPlayer.SPRITESHEET_KEY, 'assets/hld.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.weapons = new Map();
    this.weapons.set('q', new WeaponLine('assets/music/beep1.wav', 'qsound', 2, 5));
    this.weapons.set('w', new WeaponLine('assets/music/wah.wav', 'wsound', 1, 10));
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
    this.sprite = getScene().physics.add.sprite(this.initPosition.x, this.initPosition.y, MainPlayer.SPRITESHEET_KEY);
    this.sprite.scale = 2;
    this.createPlayerAnims();
  }

  handleUpdate(time: number, delta: number): void {
    super.handleUpdate(time, delta);
    this.handlePlayerMove();
    this.handleKeys(time);
    this.handleWeapons(time, delta);
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
      this.sprite.anims.play(MainPlayer.PLAYER_LEFT_ANIM_KEY, true);
    } else if (this.cursors.right.isDown) {
      this.sprite.anims.play(MainPlayer.PLAYER_RIGHT_ANIM_KEY, true);
    } else if (this.cursors.down.isDown) {
      this.sprite.anims.play(MainPlayer.PLAYER_DOWN_ANIM_KEY, true);
    } else if (this.cursors.up.isDown) {
      this.sprite.anims.play(MainPlayer.PLAYER_UP_ANIM_KEY, true);
    } else {
      this.sprite.anims.play('idle', true);
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
      key: MainPlayer.PLAYER_LEFT_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 24,
        end: 35,
      }),
      frameRate: 15,
      repeat: -1,
    });

    getScene().anims.create({
      key: MainPlayer.PLAYER_RIGHT_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 36,
        end: 47,
      }),
      frameRate: 15,
      repeat: -1,
    });

    getScene().anims.create({
      key: MainPlayer.PLAYER_UP_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 0,
        end: 11,
      }),
      frameRate: 15,
      repeat: -1,
    });

    getScene().anims.create({
      key: MainPlayer.PLAYER_DOWN_ANIM_KEY,
      frames: getScene().anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 12,
        end: 23,
      }),
      frameRate: 15,
      repeat: -1,
    });
  }
}
