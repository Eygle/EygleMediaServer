import {Episode} from './Episode';
import {AModel} from 'eygle-core/commons/models/AModel';

export class TVShow extends AModel {
  title: string;

  tvdbId: number;
  imdbId: number;

  banner: string;
  poster: string;
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
