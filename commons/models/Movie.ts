import {EygleFile} from './File';
import {AModel} from '../core/models/AModel';

export class Movie extends AModel {
  title: string;
  originalTitle: string;
  date: Date;
  countries: [{ type: string }];
  genres: [{ type: string }];
  overview: string;
  budget: number;
  revenue: number;
  originalLanguage: string;
  runtime: number;

  poster: string;
  backdrop: string;

  cast: [{
    tvdbId: number,
    name: string,
    character: string,
    image: string
  }];
  crew: [{
    tvdbId: number,
    name: string,
    job: string,
    image: string,
  }];

  videos: [{
    id: string,
    lang: string,
    key: string,
    name: string,
    site: string,
    size: number,
    videoType: string
  }];

  tmdbId: number;
  imdbId: string;

  files: Array<EygleFile | string>;
}

export class AutocompleteMovie {
  title: string;
  originalTitle: string;
  date: Date;
  poster: string;
  tmdbId: string;
}
