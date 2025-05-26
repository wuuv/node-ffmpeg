import Commander from "./Commander"

interface CutVideoCommandParams {
  input: string,
  start: string,
  duration: string
  output: string
}

export default class CutVideoCommand extends Commander {
  protected prepareArgs(args: CutVideoCommandParams) {
    return [
      '-i', args.input,
      '-ss', args.start,
      '-t', args.duration,
      '-progress', 'pipe:1',
      args.output,
    ]
  }

  override async exec(args: CutVideoCommandParams): Promise<void> {
    return super.exec(args);
  }
}