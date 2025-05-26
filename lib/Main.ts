import BinService from "./BinService";
import { CutVideoCommand, VideoDurationCommand} from "commands/Commander";


class Main {
  constructor(private readonly pathFFMPEG: string, private readonly pathFFProbe: string) {
    this.pathFFMPEG = pathFFMPEG;
    this.pathFFProbe = pathFFProbe;
  }

  async cutVideo(args: any) {
    const v = new CutVideoCommand(
      new BinService(this.pathFFMPEG),
    );
    return v.exec(args);
  }

  async getVideoLength(args: {input: string}) {
    return new VideoDurationCommand(
      new BinService(this.pathFFProbe, true)
    ).exec(args);
  }
}

export default Main;