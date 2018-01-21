/**
 * Created by eygle on 5/6/17.
 */
import {EygleFile} from "../models/file";

interface IEpisode extends IModel {
  title: string,

  tvdbId: number,
  tvdbSeasonId: number,

  tvShow: ITVShow,
  files: Array<EygleFile>,

  number: number,
  season: number,

  overview: string,
}
