import {EygleFile} from './File';
import {Media} from "./Media";

export class Movie extends Media {
  originalTitle: string;
  countries: [{ type: string }];
  budget: number;
  revenue: number;
  originalLanguage: string;
  runtime: number;

  backdrop: string;

  cast: Cast[];
  crew: Crew[];

  videos: Video[];

  files: EygleFile[];

  tmdbId: number;
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
