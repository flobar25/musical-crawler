import GameState from '../state/GameState';
import Weapon from '../weapons/Weapon';
import Character from './Character';

export default class MainPlayer extends Character {
  // constants
  static SPRITESHEET_KEY = 'SPRITESHEET_KEY';
  static PLAYER_LEFT_ANIM_KEY = 'PLAYER_LEFT_ANIM';
  static PLAYER_RIGHT_ANIM_KEY = 'PLAYER_RIGHT_ANIM';
  static PLAYER_DOWN_ANIM_KEY = 'PLAYER_DOWN_ANIM';
  static PLAYER_UP_ANIM_KEY = 'PLAYER_UP_ANIM';

  // keyboard
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: Map<string, Phaser.Input.Keyboard.Key>;
  times!: Map<string, number>;
  weapons!: Map<string, Weapon>;

  // sprite
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  handlePreload() {
    GameState.getInstance().scene.load.spritesheet(MainPlayer.SPRITESHEET_KEY, 'assets/personajes-lanto.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.weapons = new Map();
    this.weapons.set('q', new Weapon('assets/music/beep1.wav', 'qsound', 2));
    this.weapons.set('w', new Weapon('assets/music/wah.wav', 'wsound', 1));
    this.weapons.forEach((w) => GameState.getInstance().scene.load.audio(w.key, w.soundFile));
  }

  handleCreate() {
    this.cursors = GameState.getInstance().scene.input.keyboard.createCursorKeys();
    this.times = new Map();
    this.times.set('q', -1);
    this.times.set('w', -1);
    this.times.set('e', -1);
    this.keys = new Map();
    this.keys.set('q', GameState.getInstance().scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q));
    this.keys.set('w', GameState.getInstance().scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
    this.keys.set('e', GameState.getInstance().scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E));
    this.sprite = GameState.getInstance().scene.physics.add.sprite(100, 450, MainPlayer.SPRITESHEET_KEY);
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
        GameState.getInstance().scene.sound.play(w.key);
      }
    });
  }

  private createPlayerAnims() {
    GameState.getInstance().scene.anims.create({
      key: MainPlayer.PLAYER_LEFT_ANIM_KEY,
      frames: GameState.getInstance().scene.anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 12,
        end: 14,
      }),
      frameRate: 10,
      repeat: -1,
    });

    GameState.getInstance().scene.anims.create({
      key: MainPlayer.PLAYER_RIGHT_ANIM_KEY,
      frames: GameState.getInstance().scene.anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 24,
        end: 26,
      }),
      frameRate: 10,
      repeat: -1,
    });

    GameState.getInstance().scene.anims.create({
      key: MainPlayer.PLAYER_UP_ANIM_KEY,
      frames: GameState.getInstance().scene.anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 36,
        end: 38,
      }),
      frameRate: 10,
      repeat: -1,
    });

    GameState.getInstance().scene.anims.create({
      key: MainPlayer.PLAYER_DOWN_ANIM_KEY,
      frames: GameState.getInstance().scene.anims.generateFrameNumbers(MainPlayer.SPRITESHEET_KEY, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
