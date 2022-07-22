import { gameState, getScene } from '../state/GameState';

export default class Weapon {
  key: string;
  soundFile: string;
  activationTime: number;
  musicResolution: number;
  count: number;
  lines: Phaser.GameObjects.Line[];

  constructor(soundFile: string, key: string, resolution: number) {
    this.key = key;
    this.soundFile = soundFile;
    this.activationTime = -1;
    this.musicResolution = resolution;
    this.count = 1;
    this.lines = [];
  }

  activate(time?: number) {
    if (time && gameState().musicStartTime > 0) {
      this.activationTime = time;
    }
  }

  handleUpdate(time: number, delta: number): boolean {
    this.handleLines();
    return this.handleAttack(time, delta);
  }

  handleLines() {
    // TODO we could avoid doing that on each frame (once every 10 frames or so?)
    this.getClosestMonsters(this.count).forEach((m, idx) => {
      console.log(m.velocity);
      // this.lines[idx].setPosition(gameState().player.sprite.x, gameState().player.sprite.y, m.sprite.x, m.sprite.y);
      if (this.lines.length < idx + 1) {
        this.lines.push(getScene().add.line(0, 0, 0, 0, 100, 100, 0xffffff).setOrigin(0));
      }

      this.lines[idx].setTo(gameState().player.sprite.x, gameState().player.sprite.y, m.sprite.x, m.sprite.y);
    });
  }

  handleAttack(time: number, delta: number): boolean {
    const relativeTime = time - gameState().musicStartTime;
    if (this.activationTime != -1) {
      const relativeQTime = this.activationTime - gameState().musicStartTime;
      const lagTime = relativeQTime % gameState().quarterNoteDuration;
      const lagTick = Math.floor(lagTime / (gameState().quarterNoteDuration / this.musicResolution));
      const delay = lagTick * (gameState().quarterNoteDuration / this.musicResolution);
      // let delay = ((relativeQTime % this.quarterNoteDuration) / (this.musicResolution*this.quarterNoteDuration)) * (this.quarterNoteDuration * this.musicResolution);
      // console.log(delay);

      if (
        (relativeTime - delay) % (gameState().quarterNoteDuration / this.musicResolution) <=
        gameState().frameDuration
      ) {
        return true;
      }
    }

    return false;
  }

  getClosestMonsters(count: number) {
    const sortedMonsters = gameState().monsters.sort((a, b) => {
      return (
        Math.sqrt(
          (gameState().player.sprite.x - a.sprite.x) * (gameState().player.sprite.x - a.sprite.x) +
            (gameState().player.sprite.y - a.sprite.y) * (gameState().player.sprite.y - a.sprite.y)
        ) -
        Math.sqrt(
          (gameState().player.sprite.x - b.sprite.x) * (gameState().player.sprite.x - b.sprite.x) +
            (gameState().player.sprite.y - b.sprite.y) * (gameState().player.sprite.y - b.sprite.y)
        )
      );
    });

    const result = sortedMonsters.slice(0, count);
    console.log(result);
    return result;
  }
}
