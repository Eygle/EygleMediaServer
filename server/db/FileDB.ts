import * as q from 'q';
import {AModel} from 'eygle-core/commons/models/AModel';
import {fileSchema} from '../schemas/file.schema';
import ADBModel from 'eygle-core/server/db/ADBModel';

export default class FileDB extends ADBModel {

  /**
   * Get children
   * @return {Promise<AModel>}
   */
  public static getChildren(parent: string = null) {
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

  /**
   * Get all that matches given ids list
   * @param {[string]} ids
   * @returns {Q.Promise<Array<AModel>>}
   */
  public static getAllByIds(ids: [string]) {
    const defer = <q.Deferred<Array<AModel>>>q.defer();

    this._model.find()
      .where('_id').in(ids)
      .exec((err, items) => {
        if (err) return defer.reject(err);
        defer.resolve(items);
      });

    return defer.promise;
  }
}

FileDB.init(fileSchema);
module.exports.schema = FileDB; // Used by MongoDB models loader (need require)
