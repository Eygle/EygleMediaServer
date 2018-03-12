import * as q from 'q';
import TMDB, {ITMDBMovie} from '../modules/TMDB';
import {EygleFile} from '../../commons/models/File';
import ADBModel from 'eygle-core/server/db/ADBModel';
import {movieSchema} from '../schemas/Movie.schema';

export default class ProposalDB extends ADBModel {

  /**
   * Return all linked to a given file id
   * @param fid
   * @return {Q.Promise<any>}
   */
  public static getAllByFileId(fid) {
    const defer = q.defer();

    this._model.find()
      .where('file').equals(fid)
      .exec((err, item) => {
        if (err) return defer.reject(err);
        defer.resolve(item);
      });

    return defer.promise;
  }

  /**
   * Create new proposal instance from TMDB result
   * @param m
   * @param {EygleFile} file
   */
  public static createFromTMDBResult(m: ITMDBMovie, file: EygleFile) {
    return this.create({
      title: m.title,
      originalTitle: m.original_title,
      date: m.release_date ? new Date(m.release_date) : null,
      overview: m.overview,
      poster: m.poster_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('p', 154) + m.poster_path : null,
      tmdbId: m.id,
      file: file ? file._id : null
    });
  }
}

ProposalDB.init(movieSchema);
module.exports.schema = ProposalDB; // Used by MongoDB models loader (need require)
