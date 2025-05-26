import { EventEmitter } from "node:stream";
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import ProgressBar from './ProgressBar';

class BinService {
  private readonly bin: any;
  private eventEmitter = new EventEmitter();
  private readonly isFFProbe: boolean = false;
  constructor(path: string, fffProbe?: boolean) {
    this.bin = path;
    this.isFFProbe = !!fffProbe
  }

  async run (args: any) {
    return new Promise<void>((resolve, reject) => {
      const process = spawn(this.bin, args);
      this.addEventListeners(process);
      this.addDebugEventListeners(process);
      // new ProgressBar(this.eventEmitter).start(args);
      this.eventEmitter.on('finish:error', (code: number) => {
        reject(code)
      })
      this.eventEmitter.on('finish:success', (data) => {
        resolve(data);
      })
    });
  }

  private parseStdout(output: string) {
    return output.split(/\s+/)
    .filter(part => part.includes('='))
    .reduce<Record<string, string>>((acc, part) => {
      const [key, value] = part.split('=');
      const oKey = key.trim();
      acc[oKey] = value.trim();
      return acc;
    }, {});
  }

  private addDebugEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stderr.on('data', (chunk) => {
      console.log(chunk);
      const str = chunk.toString();
      console.log(str);
    })
    process.stderr.on('error', (chunk) => {
      const str = chunk.toString();
      console.log(str);
    })
  }

  private addEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', (chunk: string) => {
      const str = chunk.toString();
      console.log(str);
      const outParsed = this.parseStdout(str);
      this.eventEmitter.emit('parsed chunk', outParsed);
      if (this.isFFProbe) {
        return this.eventEmitter.emit('done', str);
      }
    })
    process.on('close', (code) => {
      if (code === 0) {
        this.eventEmitter.emit('finish:success');
      } else {
        this.eventEmitter.emit('finish:error', code)
      }
    });
  }
}

export default BinService;
