import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../core/modules/DB';
import ASchema from '../core/schemas/ASchema.schema';
import TMDB, {ITMDBMovie} from '../modules/TMDB';
import {EygleFile} from '../../commons/models/File';

const _schema: mongoose.Schema = DB.createSchema({
  title: String,
  originalTitle: String,
  date: Date,
  overview: String,
  poster: String,

  tmdbId: Number,

  file: {type: String, ref: 'File'}
}, false);

class ProposalSchema extends ASchema {

  /**
   * Return all linked to a given file id
   * @param fid
   * @return {Q.Promise<any>}
   */
  public getAllByFileId(fid) {
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
  public createFromTMDBResult(m: ITMDBMovie, file: EygleFile) {
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

  /**
   * Schema getter
   * @return {mongoose.Schema}
   */
  getSchema(): mongoose.Schema {
    return _schema;
  }
}

const instance = new ProposalSchema();

module.exports.schema = instance;
export default instance;
