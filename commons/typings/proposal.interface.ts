import {EygleFile} from "../models/file";

interface IProposal extends IModel {
  title: string;
  originalTitle: string;
  date: Date;
  overview: string;
  poster: string;

  tmdbId: number;

  file: EygleFile
}
