import * as mongoose from 'mongoose';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import Utils from '../config/Utils';
import * as q from 'q';
import {AModel} from '../../commons/models/model.abstract';

const _schema: mongoose.Schema = DB.createSchema({
  filename: String,
  ext: String,
  size: Number,
  path: String,
  normalized: String,
  mtime: Date,
  directory: Boolean,

  mediaInfo: {
    title: String,
    season: Number,
    episode: Number,
    episodeName: String,
    region: String,
    year: Number,
    language: String,
    resolution: String,
    repack: Boolean,
    quality: String,
    proper: Boolean,
    hardcoded: Boolean,
    extended: Boolean,
    codec: String,
    audio: String,
    group: String,
    excess: [{
      type: String
    }]
  },

  parent: {type: String, ref: 'File'},
  episode: {type: String, ref: 'MovieSchema'},
  movie: {type: String, ref: 'MovieSchema'},
});

_schema.pre('save', function (next) {
  if (this.isNew) {
    this.normalized = Utils.normalize(this.filename);
  }
  next();
});

class FileSchema extends ASchema {

  /**
   * Schema getter
   * @return {mongoose.Schema}
   */
  getSchema(): mongoose.Schema {
    return _schema;
  }

  /**
   * Get children
   * @return {Promise<IModel>}
   */
  public getChildren(parent: string = null) {
    const defer = <q.Deferred<Array<AModel>>>q.defer();

    this._model.find()
      .where('parent').equals(parent)
      .select('filename mtime size ext directory movie tvshow')
      .sort({mtime: -1})
      .exec((err, items) => {
        if (err) return defer.reject(err);
        defer.resolve(items);
      });

    return defer.promise;
  }
}

const instance = new FileSchema();

module.exports.schema = instance;
export default instance;
