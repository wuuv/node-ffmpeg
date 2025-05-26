import Commander from "./Commander"

export default class VideoDurationCommand extends Commander {
  protected prepareArgs(args: {input: string}) {
    return [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      args.input
    ]
  }

  async exec(args: {input: string}) {
    return this.service.run(this.prepareArgs(args));
  }
}