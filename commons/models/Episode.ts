import {EygleFile} from './file';
import {AModel} from '../core/models/AModel';
import {TVShow} from './tvshow';

export class Episode extends AModel {
  title: string;

  tvdbId: number;
  tvdbSeasonId: number;

  tvShow: TVShow;
  files: Array<EygleFile>;

  number: number;
  season: number;

  overview: string;
}
