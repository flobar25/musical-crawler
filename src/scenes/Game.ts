import Phaser from 'phaser';
import MainPlayer from '../modules/characters/MainPlayer';
import Monster from '../modules/characters/Monster';
import GameState from '../modules/state/GameState';

const SPRITESHEET = 'spritesheet';
const DRUMS = 'drums';
const SYNTH1 = 'synth1';
const SYNTH2 = 'synth2';
const MONSTER_LEFT_ANIM = 'monsterleftanim';
const MONSTER_RIGHT_ANIM = 'monsterrightanim';
const MONSTER_DOWN_ANIM = 'monsterdownanim';
const MONSTER_UP_ANIM = 'monsterupanim';

// velocities
const MONSTER_VELOCITY = 80;

export default class Demo extends Phaser.Scene {
  player: MainPlayer;
  monster: Monster;

  // player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // monster!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // attackRate!: number;
  // synth!: Tone.Synth;

  quarterNoteDuration!: number;
  frameDuration!: number;
  drums!: Phaser.Sound.BaseSound;
  synth1!: Phaser.Sound.BaseSound;
  halfNoteDuration!: number;
  synth2!: Phaser.Sound.BaseSound;
  musicResolution = 4; // a quarter of a quarter note

  constructor() {
    super('GameScene');
    this.player = new MainPlayer(160, { x: 100, y: 450 });

    this.monster = new Monster(70, { x: 200, y: 500 });
  }

  preload() {
    GameState.getInstance().initState(109, this);
    this.player.handlePreload();
    this.monster.handlePreload();
    this.load.spritesheet(SPRITESHEET, 'assets/personajes-lanto.png', { frameWidth: 32, frameHeight: 32 });
    this.load.audio(DRUMS, 'assets/music/OLIVER_hat_drum_loop_ride_clap_109.wav');
  }

  create() {
    this.player.handleCreate();
    this.monster.handleCreate(this.player.sprite);

    // sound
    this.drums = this.sound.add(DRUMS);
    this.sound.pauseOnBlur = false;

    // characters
    // this.player = this.physics.add.sprite(100, 450, SPRITESHEET);
    // this.monster = this.physics.add.sprite(300, 450, SPRITESHEET);
    // this.cursors = this.input.keyboard.createCursorKeys();
    // this.createPlayerAnims();
    // this.createMonsterAnims();

    // this.quarterNoteDuration = 60000 / this.bpm;
    // this.halfNoteDuration = this.quarterNoteDuration * 2;
    // this.frameDuration = 1000 / this.physics.world.fps;

    // Tone.start().then(() => (this.synth = new Tone.Synth().toDestination()));
  }

  update(time: number, delta: number): void {
    this.handleMusic(time);
    this.player.handleUpdate(time, delta);
    this.monster.handleUpdate(time, delta);
  }

  private handleMusic(time: number) {
    if (GameState.getInstance().musicStartTime > -1) {
      return;
    }

    this.drums.play('', { loop: true });
    GameState.getInstance().musicStartTime = time;
  }

  // private handleMonsterMoves(monster: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
  //   let velocityX = 0;
  //   let velocityY = 0;

  //   if (this.player.x < monster.x) {
  //     velocityX = -MONSTER_VELOCITY;
  //   } else if (this.player.x > monster.x) {
  //     velocityX = MONSTER_VELOCITY;
  //   } else {
  //     velocityX = 0;
  //   }

  //   if (this.player.y < monster.y) {
  //     velocityY = -MONSTER_VELOCITY;
  //   } else if (this.player.y > monster.y) {
  //     velocityY = MONSTER_VELOCITY;
  //   } else {
  //     velocityY = 0;
  //   }

  //   if (velocityX < 0) {
  //     monster.anims.play(MONSTER_LEFT_ANIM, true);
  //   } else if (velocityX > 0) {
  //     monster.anims.play(MONSTER_RIGHT_ANIM, true);
  //   } else if (velocityY > 0) {
  //     monster.anims.play(MONSTER_UP_ANIM, true);
  //   } else if (velocityY < 0) {
  //     monster.anims.play(MONSTER_DOWN_ANIM, true);
  //   } else {
  //     monster.anims.play('idle', true);
  //   }

  //   monster.setVelocity(velocityX, velocityY);
  // }

  // private createMonsterAnims() {
  //   this.anims.create({
  //     key: MONSTER_LEFT_ANIM,
  //     frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 15, end: 17 }),
  //     frameRate: 10,
  //     repeat: -1,
  //   });

  //   this.anims.create({
  //     key: MONSTER_RIGHT_ANIM,
  //     frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 27, end: 29 }),
  //     frameRate: 10,
  //     repeat: -1,
  //   });

  //   this.anims.create({
  //     key: MONSTER_UP_ANIM,
  //     frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 39, end: 41 }),
  //     frameRate: 10,
  //     repeat: -1,
  //   });

  //   this.anims.create({
  //     key: MONSTER_DOWN_ANIM,
  //     frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 2, end: 5 }),
  //     frameRate: 10,
  //     repeat: -1,
  //   });
  // }
}
