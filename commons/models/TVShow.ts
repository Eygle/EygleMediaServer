import {Episode} from './Episode';
import {Media} from "./Media";

export class TVShow extends Media {
  banner: string;

  actors: [string]; // TODO change

  seasons: number;
  episodes: number;
  start: Date;
  end: Date;
  network: string;

  status: string;

  episodesList: Array<Episode>;

  tvdbId: number;
}
