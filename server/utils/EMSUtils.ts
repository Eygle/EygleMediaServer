import * as path from 'path';
import {EygleFile} from '../../commons/models/File';
import {EEnv} from 'eygle-core/commons/core.enums';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

class EMSUtils {
  public mediasRoot: string;

  constructor() {
    this.mediasRoot = path.normalize(EEnv.Dev === ServerConfig.env ? `${ServerConfig.root}/../medias` : `${ServerConfig.filesRoot}/medias`);
  }

  public getFileRealPath(file: EygleFile) {
    let filePath = this.mediasRoot;

    if (file.path) {
      filePath += `/${file.path}`;
    }
    filePath += `/${file.filename}`;

    return filePath;
  }
}

export default new EMSUtils();
