import {EygleFile} from './File';
import {AModel} from '../core/models/AModel';

export class Proposal extends AModel {
  title: string;
  originalTitle: string;
  date: Date;
  overview: string;
  poster: string;

  tmdbId: number;

  file: EygleFile;
}
