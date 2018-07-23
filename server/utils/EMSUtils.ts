import * as path from 'path';
import {EygleFile} from '../../commons/models/File';
import {EEnv} from 'eygle-core/commons/core.enums';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

class EMSUtils {
  /**
   * Media root
   */
  public mediaRoot: string;

  /**
   * Path where the movies are stored
   */
  public moviesRoot: string;

  /**
   * Path where the tv shows are stores
   */
  public tvShowsRoot: string;

  constructor() {
    this.mediaRoot = path.normalize(EEnv.Dev === ServerConfig.env ? `${ServerConfig.root}/../medias` : `${ServerConfig.filesRoot}/medias`);
    this.moviesRoot = path.join(this.mediaRoot, 'movies');
    this.tvShowsRoot = path.join(this.mediaRoot, 'tv-shows');
  }

  public getFileRealPath(file: EygleFile) {
    let filePath = this.mediaRoot;

    if (file.path) {
      filePath += `/${file.path}`;
    }
    filePath += `/${file.filename}`;

    return filePath;
  }
}

export default new EMSUtils();
