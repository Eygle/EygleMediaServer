import {Episode} from './Episode';
import {Media} from "./Media";

export class TVShow extends Media {
  tvdbId: number;
  imdbId: number;

  banner: string;
  genres: [{ type: string }];
  overview: string;

  actors: [string]; // TODO change

  seasons: number;
  episodes: number;
  start: Date;
  end: Date;
  network: string;

  episodesList: Array<Episode>;
}
