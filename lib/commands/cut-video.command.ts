import Commander from "./Commander"

export default class CutVideoCommand extends Commander {
  protected prepareArgs(args: any) {
    return [
      '-i', args.input,
      '-ss', args.start,
      '-t', args.duration,
      '-progress', 'pipe:1',
      args.output,
    ]
  }
}