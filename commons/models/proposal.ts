import {EygleFile} from './file';
import {AModel} from './model.abstract';

export class Proposal extends AModel {
  title: string;
  originalTitle: string;
  date: Date;
  overview: string;
  poster: string;

  tmdbId: number;

  file: EygleFile;
}
