import CLIProgressBar from 'cli-progress';
import { EventEmitter } from 'node:stream';

class ProgressBar {
  private readonly bar: CLIProgressBar.Bar;
  constructor(private readonly eventEmitteter: EventEmitter) {
    this.bar = new CLIProgressBar.SingleBar({
      emptyOnZero: true,
      format: 'Прогресс: {bar} | {percentage}% | {value}/{total} сек.'
    }, CLIProgressBar.Presets.shades_classic);
    this.addEventListeners();
  }

  private addEventListeners() {
    this.eventEmitteter.on('parsed chunk', (chunk) => {
      const {out_time} = chunk;
      if (chunk.progress === 'continue' && chunk.speed !== 'N/A') {
        this.bar.update(Math.round(this.timeToSeconds(out_time)));
      }
    })

    this.eventEmitteter.on('done', () => {
      this.bar.stop();
    })
  }

  private timeToSeconds(timeStr: string) {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }

  start(args: any) {
    let start = null;
    let finish = null;

    // Проходим по массиву и ищем параметры
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-ss') {
        start = args[i + 1]; // Значение после -ss
      } else if (args[i] === '-t') {
        finish = args[i + 1]; // Значение после -t
      }
    }

    this.bar.start(Number(finish), Number(start));
  }
}

export default ProgressBar;