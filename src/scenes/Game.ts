import Phaser from 'phaser';
import * as Tone from 'tone';

const SPRITESHEET = 'spritesheet';
const DRUMS = 'drums';
const SYNTH1 = 'synth1';
const SYNTH2 = 'synth2';

const PLAYER_LEFT_ANIM = 'playerleftanim';
const PLAYER_RIGHT_ANIM = 'playerrightanim';
const PLAYER_DOWN_ANIM = 'playerdownanim';
const PLAYER_UP_ANIM = 'playerupanim';
const MONSTER_LEFT_ANIM = 'monsterleftanim';
const MONSTER_RIGHT_ANIM = 'monsterrightanim';
const MONSTER_DOWN_ANIM = 'monsterdownanim';
const MONSTER_UP_ANIM = 'monsterupanim';

// velocities
const PLAYER_VELOCITY = 160;
const MONSTER_VELOCITY = 80;


export default class Demo extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  monster!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  attackRate!: number;
  synth!: Tone.Synth;
  bpm!: number;


  quarterNoteDuration!: number;
  frameDuration!: number;
  musicStartTime: number = -1;
  drums!: Phaser.Sound.BaseSound;
  synth1!: Phaser.Sound.BaseSound;
  halfNoteDuration!: number;
  synth2!: Phaser.Sound.BaseSound;
  musicResolution = 4 ; // a quarter of a quarter note

  // keyboard state
  qTime = -1;
  wTime = -1;
  eTime = -1;
  qKey!: Phaser.Input.Keyboard.Key;
  wKey!: Phaser.Input.Keyboard.Key;
  eKey!: Phaser.Input.Keyboard.Key;


  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.spritesheet(SPRITESHEET, 'assets/personajes-lanto.png', { frameWidth: 32, frameHeight: 32 });
    this.load.audio(DRUMS, 'assets/music/OLIVER_hat_drum_loop_ride_clap_109.wav')
    this.load.audio(SYNTH1, 'assets/music/beep1.wav')
    this.load.audio(SYNTH2, 'assets/music/wah.wav')
  }

  create() {
    // keyboard
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // sound
    this.drums = this.sound.add(DRUMS)
    this.synth1 = this.sound.add(SYNTH1)
    this.synth2 = this.sound.add(SYNTH2)
    this.sound.pauseOnBlur = false;

    // characters
    this.player = this.physics.add.sprite(100, 450, SPRITESHEET);
    this.monster = this.physics.add.sprite(300, 450, SPRITESHEET);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createPlayerAnims();
    this.createMonsterAnims();

    this.bpm = 109;
    this.quarterNoteDuration = 60000 / this.bpm;
    this.halfNoteDuration = this.quarterNoteDuration * 2;
    this.frameDuration = 1000 / this.physics.world.fps;
    this.attackRate = 1;

    Tone.start().then(() => this.synth = new Tone.Synth().toDestination());
  }

  update(time: number, delta: number): void {
    this.handleMusic(time);
    this.handlePlayerMoves();
    this.handleMonsterMoves(this.monster);
    this.handlePlayerAttacks(time);
  }

  private handleMusic(time: number) {
    if (!this.synth) {
      return;
    }
    if (this.musicStartTime > -1) {
      return;
    }

    this.drums.play('', { loop: true });
    this.musicStartTime = time;
  }

  private handlePlayerAttacks(time: number) {
    if (this.qTime === -1 && this.qKey.isDown) {
      this.qTime = time;
    }
    if (this.wTime === -1 && this.wKey.isDown) {
      this.wTime = time;
    }
    if (this.eTime === -1 && this.eKey.isDown) {
      this.eTime = time;
    }

    if (this.qKey.isUp) {
      this.qTime = -1;
    }
    if (this.wKey.isUp) {
      this.wTime = -1;
    }
    if (this.eKey.isUp) {
      this.eTime = -1;
    }

    // console.log(this.qTime);
    let relativeTime = time - this.musicStartTime;
    

    if (this.qTime !== -1) {
      let relativeQTime = this.qTime - this.musicStartTime;
      let lagTime = relativeQTime % this.quarterNoteDuration;
      let lagTick = Math.floor(lagTime / (this.quarterNoteDuration / this.musicResolution));
      let delay = lagTick * (this.quarterNoteDuration / this.musicResolution)
      // let delay = ((relativeQTime % this.quarterNoteDuration) / (this.musicResolution*this.quarterNoteDuration)) * (this.quarterNoteDuration * this.musicResolution);
      console.log(delay)

      if ((relativeTime - delay) % (this.quarterNoteDuration / 2) <= this.frameDuration) {
        this.synth1.play();
      }
    }

    if (this.wTime !== -1) {
      if ((time - this.musicStartTime) % this.halfNoteDuration <= this.frameDuration) {
        this.synth2.play();
      }
    }


  }


  private handlePlayerMoves() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_VELOCITY);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_VELOCITY);

    } else if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
      this.player.setVelocityX(0);
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(PLAYER_VELOCITY);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-PLAYER_VELOCITY);

    } else if (!this.cursors.down.isDown && !this.cursors.up.isDown) {
      this.player.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.player.anims.play(PLAYER_LEFT_ANIM, true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play(PLAYER_RIGHT_ANIM, true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play(PLAYER_DOWN_ANIM, true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play(PLAYER_UP_ANIM, true);
    } else {
      this.player.anims.play('idle', true);
    }
  }

  private handleMonsterMoves(monster: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    let velocityX = 0;
    let velocityY = 0;

    if (this.player.x < monster.x) {
      velocityX = -MONSTER_VELOCITY;
    } else if (this.player.x > monster.x) {
      velocityX = MONSTER_VELOCITY;
    } else {
      velocityX = 0;
    }

    if (this.player.y < monster.y) {
      velocityY = -MONSTER_VELOCITY;
    } else if (this.player.y > monster.y) {
      velocityY = MONSTER_VELOCITY;
    } else {
      velocityY = 0;
    }

    if (velocityX < 0) {
      monster.anims.play(MONSTER_LEFT_ANIM, true);
    } else if (velocityX > 0) {
      monster.anims.play(MONSTER_RIGHT_ANIM, true);
    } else if (velocityY > 0) {
      monster.anims.play(MONSTER_UP_ANIM, true);
    } else if (velocityY < 0) {
      monster.anims.play(MONSTER_DOWN_ANIM, true);
    } else {
      monster.anims.play('idle', true);
    }

    monster.setVelocity(velocityX, velocityY);
  }

  private createPlayerAnims() {
    this.anims.create({
      key: PLAYER_LEFT_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 12, end: 14 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: PLAYER_RIGHT_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 24, end: 26 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: PLAYER_UP_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 36, end: 38 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: PLAYER_DOWN_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private createMonsterAnims() {
    this.anims.create({
      key: MONSTER_LEFT_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 15, end: 17 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: MONSTER_RIGHT_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 27, end: 29 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: MONSTER_UP_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 39, end: 41 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: MONSTER_DOWN_ANIM,
      frames: this.anims.generateFrameNumbers(SPRITESHEET, { start: 2, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
  }
}
