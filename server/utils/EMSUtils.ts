import ProjectConfig from "../core/config/ProjectConfig";
import {EEnv} from '../core/typings/server.enums';
import * as path from "path";
import {EygleFile} from "../../commons/models/File";

class EMSUtils {
  public mediasRoot: string;

  constructor() {
    this.mediasRoot = path.normalize(EEnv.Dev === ProjectConfig.env ? `${ProjectConfig.root}/../medias` : `${ProjectConfig.filesRoot}/medias`);
  }

  public getFileRealPath(file: EygleFile) {
    let path = this.mediasRoot;

    if (file.path) {
      path += `/${file.path}`;
    }
    path += `/${file.filename}`;

    return path;
  }
}

export default new EMSUtils();
