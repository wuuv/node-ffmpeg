import { EventEmitter } from "node:stream";
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import ErrorFactory from "./errors";
import path from "node:path";


abstract class Bin {
  protected eventEmitter = new EventEmitter();
  private readonly arguments = [
    "-loglevel",
    "error",
    "-hide_banner",
  ]
  constructor(
    private readonly bin: string,
  ) {

  }

  async run(args: any) {
    return new Promise<any | never>((res, rej) => {
      const process = spawn(this.bin, this.arguments.concat(args));
      process.stderr.setEncoding('utf-8');
      process.stdout.setEncoding('utf-8');
      const stderrMessages: Array<string> = [];
      const stdoutMessages: Array<string> = [];
      [
        this.addProcessEventListeners,
        this.addStdoutEventListeners,
        this.addStderrEventListeners,
      ].forEach(fn => fn.call(this, process));
      this.eventEmitter.on('stderr:data', v => stderrMessages.push(v));
      this.eventEmitter.on('stdout:data', v => stdoutMessages.push(v));
      this.eventEmitter.on('close', (code) => {
        if (stderrMessages.length) {
          const BinError = ErrorFactory.matchError(stderrMessages);
          rej(BinError);
        } else {
          res(stdoutMessages);
        }
      });
    })
  }

  private addProcessEventListeners(process: ChildProcessWithoutNullStreams) {
    process.on('exit', (code, signal) => {
      this.eventEmitter.emit('close', code);
    });
  }

  private addStdoutEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stdout.on('data', data => {
      const str = data.toString().trim();
      console.log('stdout', str)
      this.eventEmitter.emit('stdout:data', str);
    })

  }

  private addStderrEventListeners(process: ChildProcessWithoutNullStreams) {
    process.stderr.on('data', (buffer) => {
      const parsed = this.parseStderr(buffer)
      console.log('stderr', parsed)
      if (parsed) {
        this.eventEmitter.emit('stderr:data', parsed);
      }
    });
  }

  private parseStderr(error: string) {
    return error.split(/\r\n|\r|\n/g).reduce((messages, message) => {
      if (message.charAt(0) === ' ' || message.charAt(0) === '[') {
        return [];
      } else {
        messages.push(message.trim());
        return messages;
      }
    }, [] as Array<string>).join('');
  }
}


class FFMpeg extends Bin {
  constructor() {
    const binPath = path.join(__dirname, '../../bin/ffmpeg');
    super(binPath);
  }
}

class FFProbe extends Bin {
  constructor() {
    const binPath = path.join(__dirname, '../../bin/ffprobe');
    super(binPath);
  }

  async run(args: any): Promise<any> {
    try {
      const result = await super.run(args);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
}

export {
  FFProbe,
  FFMpeg,
  Bin,
};
