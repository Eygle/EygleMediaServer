import {AModel} from "./model.abstract";

export class EygleFile extends AModel {
  filename: string;
  ext: string;
  size: number;
  path: string;
  normalized: string;
  mtime: Date;

  episode: IEpisode | string;
  movie: IMovie;

  parent: EygleFile;

  mediaInfo: {
    title: string;
    season: number;
    episode: number;
    episodeName: string;
    year: number;
    region: string;
    language: string;
    resolution: string;
    repack: boolean;
    quality: string;
    proper: boolean;
    hardcoded: boolean;
    extended: boolean;
    codec: string;
    audio: string;
    group: string;

    excess: [{
      type: string;
    }];
  };

  // View
  loading: boolean;
  selected: boolean;
  directory: EygleFile;
  children: Array<EygleFile>;
}
