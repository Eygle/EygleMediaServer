import * as q from 'q';
import * as _ from 'underscore';

import {ITVDBEpisode} from '../modules/TVDB';
import {EygleFile} from '../../commons/models/File';
import {Episode} from '../../commons/models/Episode';
import {TVShow} from '../../commons/models/TVShow';
import {episodeSchema} from '../schemas/Episode.schema';
import ADBModel from 'eygle-core/server/db/ADBModel';

export default class EpisodeDB extends ADBModel {

  /**
   * Find all episodes by tvshow id
   * @param {string} tid
   * @return {Q.Promise<any>}
   */
  public static findAllByTVShowId(tid: string) {
    const defer = q.defer();

    this._model.find()
      .where('tvShow').equals(tid)
      .populate('files')
      .exec((err, item) => {
        if (err) return defer.reject(err);
        defer.resolve(item);
      });

    return defer.promise;
  }

  /**
   * Create or update (if exists) episode from TVDB episode result
   * @param {TVShow} show
   * @param {ITVDBEpisode} res
   * @param files
   * @return {Q.Promise<any>}
   */
  public static createOrUpdateFromTVDBResult(show: TVShow, res: ITVDBEpisode, files: Array<EygleFile>) {
    const defer = q.defer();

    this._model.findOne()
      .where('tvdbId').equals(res.id)
      .exec((err, item: Episode) => {
        if (err || !item) {
          const ep = this.create({
            title: res.episodeName,
            tvdbId: res.id,
            tvShow: show._id,
            files: _.map(files, (f) => {
              return f._id.toString();
            }),
            number: res.airedEpisodeNumber,
            season: res.airedSeason,
            overview: res.overview,
            date: res.firstAired
          });
          for (const file of files) {
            file.episode = ep._id;
          }
          return defer.resolve(ep);
        }

        item.files = item.files.concat(<any>_.map(files, (f) => {
          return f._id.toString();
        }));
        for (const file of files) {
          file.episode = item._id;
        }
        defer.resolve(item);
      });
    return defer.promise;
  }
}

EpisodeDB.init(episodeSchema);
module.exports.schema = EpisodeDB; // Used by MongoDB models loader (need require)
