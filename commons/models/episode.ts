import {EygleFile} from './file';
import {AModel} from './model.abstract';
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
