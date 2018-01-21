/**
 * Created by eygle on 4/29/17.
 */
import {EygleFile} from "../models/file";

interface ILocalFile {
  filename: string;
  directory: boolean;
  parent: string;
  children: Array<ILocalFile>;

  movie: string
  tvshow: string

  ext?: string;
  path?: string;
  size?: number;
  mtime?: Date;
  mediaInfo: ITorrentInfo;

  model: EygleFile;
}

interface ITorrentInfo {
  title: string;
  year: number;
  season: number;
  episode: number;
  resolution: string;
  quality: string;
  codec: string;
  group: string;
  hardcoded: boolean;
}
