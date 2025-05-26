import Main from './Main';
import * as path from 'path';

// interface CutVideoCommandArgumentsI {
//   start: string
//   input: string
//   duration: string
//   output: string
// }

class Service {
  private readonly Main = new Main(
    path.join(__dirname, '../bin/ffmpeg'),
    path.join(__dirname, '../bin/ffprobe')
  );

  async run() {
    try {
      const stringLength = await this.Main.getVideoLength({
        input: path.join(__dirname, '..', 'tests', 'test.mp4'),
      }) as unknown as string;
      console.log(stringLength);
    } catch (err) {
      console.log(err);
    }
  }

  private formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
}

new Service().run();