import {AModel} from 'eygle-core/commons/models/AModel';

export class Media extends AModel {
  title: string;

  genres: { type: string }[];
  overview: string;

  poster: string;
  posterThumb: string;

  date?: Date;

  imdbId: string;
}
