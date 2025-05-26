import {Bin} from '../service/bin';

export default class Commander {
  constructor(
    protected service: Bin
  ) {}

  protected prepareArgs(args: any): string[] {
    return []
  }

  async exec(args: any) {
    try {
      await this.service.run(this.prepareArgs(args));
    } catch (err) {
      if (Number.isInteger(err)) {
        throw new Error();
      }
      throw new Error();
    }
  }
}