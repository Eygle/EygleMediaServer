import {EygleFile} from './File';
import {AModel} from '../core/models/AModel';
import {TVShow} from './TVShow';

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
