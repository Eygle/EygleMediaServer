import * as q from 'q';
import * as _ from 'underscore';

import Utils from 'eygle-core/commons/utils/Utils';
import MovieDB from '../../db/MovieDB';
import FileDB from '../../db/FileDB';
import TMDB from '../../modules/TMDB';
import {ARoute} from 'eygle-core/server/middlewares/Resty';
import {EPermission} from 'eygle-core/commons/core.enums';
import {RestyCallback} from 'eygle-core/server/typings/resty.interface';
import {EygleFile} from '../../../commons/models/File';
import {Movie} from '../../../commons/models/Movie';

/**
 * Resource class
 */
class Resource extends ARoute {

  constructor() {
    super();
    this.setGetPermission(EPermission.SeeMovies);
    this.setPostOrPutPermission(EPermission.EditMovies);
  }

  /**
   * Resource GET Route
   * @param id
   * @param next
   */
  public get(id: string, next: RestyCallback): void {
    MovieDB.get(id, {populate: 'files'})
      .then(next)
      .catch(next);
  }

  /**
   * Resource PUT Route - Change movie related to file
   * @param fid
   * @param next
   */
  public put(fid: string, next: RestyCallback): void {
    FileDB.get(fid)
      .then((file: EygleFile) => {
        TMDB.get(this.body.tmdbId, file)
          .then((movie: Movie) => {
            MovieDB.findWithFileId(fid)
              .then((items: Array<Movie>) => {
                const promises = [];

                for (const m of items) {
                  if (!Utils.compareIds(m, movie)) {
                    promises.push(this._unlinkMovie(m, fid));
                  }
                }

                q.allSettled(promises)
                  .then(() => {
                    q.allSettled([
                      FileDB.save(file),
                      MovieDB.save(movie)
                    ])
                      .then(() => next())
                      .catch(next);
                  });
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }

  /**
   * Unlink movie from file
   * @param {Movie} movie
   * @param fileId
   * @return {Q.Promise<any>}
   * @private
   */
  private _unlinkMovie(movie: Movie, fileId) {
    const defer = q.defer();

    if (movie.files.length > 1) {
      const idx = _.findIndex(movie.files, (f) => {
        return Utils.compareIds(f, fileId);
      });

      if (!!~idx) {
        const f = <EygleFile>movie.files.splice(idx, 1)[0];

        f.movie = null;
        q.allSettled([
          FileDB.save(f),
          MovieDB.save(movie)
        ])
          .then(defer.resolve)
          .catch(defer.reject);
      } else {
        defer.resolve();
      }
    } else if (movie.files.length === 1) {
      (<EygleFile>movie.files[0]).movie = null;
      q.allSettled([
        FileDB.save(movie.files[0]),
        MovieDB.setDeleted(movie)
      ])
        .then(defer.resolve)
        .catch(defer.reject);
    } else {
      MovieDB.setDeleted(movie)
        .then(defer.resolve)
        .catch(defer.reject);
    }

    return defer.promise;
  }
}

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.SeeMovies);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    MovieDB.getAll({
      select: {title: 1, date: 1, posterThumb: 1, files: 1},
      populate: {path: 'files', select: 'mtime'},
      sort: {creationDate: -1},
      limit: this.query.limit
    })
      .then(next)
      .catch(next);
  }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;
