import {EygleFile} from './File';
import {AModel} from 'eygle-core/commons/models/AModel';

export class Movie extends AModel {
  title: string;
  originalTitle: string;
  date: Date;
  countries: [{ type: string }];
  genres: { type: string }[];
  overview: string;
  budget: number;
  revenue: number;
  originalLanguage: string;
  runtime: number;

  poster: string;
  posterThumb: string;
  backdrop: string;

  cast: Cast[];
  crew: Crew[];

  videos: Video[];

  tmdbId: number;
  imdbId: string;

  files: Array<EygleFile | string>;
}

export class Cast {
  tvdbId: number;
  name: string;
  character: string;
  image: string;
}

export class Crew {
  tvdbId: number;
  name: string;
  job: string;
  image: string;
}

export class Video {
  id: string;
  lang: string;
  key: string;
  name: string;
  site: string;
  size: number;
  videoType: string;

}

export class AutocompleteMovie {
  title: string;
  originalTitle: string;
  date: Date;
  poster: string;
  tmdbId: string;
}
