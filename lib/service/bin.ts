import { EventEmitter } from "node:stream";
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
// import ProgressBar from './ProgressBar';
import path from "node:path";


abstract class Bin {
  protected eventEmitter = new EventEmitter();
  constructor(
    private readonly bin: string,
  ) {

  }

  async run (args: any) {
    return new Promise<void>((res, rej) => {
      const process = spawn(this.bin, args);
      [
        this.addProcessEventListeners,
        this.addStdoutEventListeners,
      ].forEach(fn => fn.call(this, process));
      this.eventEmitter.on('data', console.log);
      this.eventEmitter.on('error', console.error);
      this.eventEmitter.on('finish:success', res);
      this.eventEmitter.on('finish:error', rej);
    })
  }

  private addProcessEventListeners (process: ChildProcessWithoutNullStreams) {
    process.on('close', (code) => {
      if (code === 0) {
        this.eventEmitter.emit('finish:success');
      } else {
        this.eventEmitter.emit('finish:error', code)
      }
    });
  }

  protected abstract addStdoutEventListeners (process: ChildProcessWithoutNullStreams): void
}


class FFMpeg extends Bin {
  constructor() {
    const binPath = path.join(__dirname, '../../bin/ffmpeg');
    super(binPath);
  }

  // private parseStdout(output: string) {
  //   return output.split(/\s+/)
  //   .filter(part => part.includes('='))
  //   .reduce<Record<string, string>>((acc, part) => {
  //     const [key, value] = part.split('=');
  //     const oKey = key.trim();
  //     acc[oKey] = value.trim();
  //     return acc;
  //   }, {});
  // }

  protected override addStdoutEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stdout.on('data', (chunk) => {
      console.log(chunk);
      const str = chunk.toString();
      console.log(str);
    })
    process.stdout.on('error', (chunk) => {
      const str = chunk.toString();
      console.log(str);
    })
  }
}

class FFProbe extends Bin {
  constructor() {
    const binPath = path.join(__dirname, '../../bin/ffprobe');
    super(binPath);
  }

  protected addStdoutEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stdout.on('data', (chunk) => {
      const str = chunk.toString();
      this.eventEmitter.emit('finish:success', str);
    })
    process.stdout.on('error', (chunk) => {
      const str = chunk.toString();
    })
  }
}

export {
  FFProbe,
  FFMpeg,
  Bin,
};
