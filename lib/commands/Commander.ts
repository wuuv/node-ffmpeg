import {Bin} from '../service/bin';

export default class Commander {
  constructor(
    protected readonly bin: Bin
  ) {}

  protected prepareArgs(args: any): string[] {
    return []
  }

  async exec(args: any) {
    await this.bin.run(this.prepareArgs(args));
  }
}