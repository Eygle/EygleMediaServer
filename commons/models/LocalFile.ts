import {EygleFile} from './File';

export class LocalFile {
  filename: string;
  directory: boolean;
  parent: string;
  children: Array<LocalFile>;

  movie: string;
  tvshow: string;

  ext?: string;
  path?: string;
  size?: number;
  mtime?: Date;
  mediaInfo: TorrentInfo;

  model: EygleFile;
}

export class TorrentInfo {
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
