import * as q from 'q';
import * as _ from 'underscore';
import EpisodeDB from './EpisodeDB';
import {ITVDBShow} from '../modules/TVDB';
import {tvShowSchema} from '../schemas/tvShow.schema';
import ADBModel from 'eygle-core/server/db/ADBModel';
import Utils from "eygle-core/commons/utils/Utils";

export default class TVShowDB extends ADBModel {
  /**
   * Get full TVShowDB with episodes list
   * @param {string} id
   * @return {Q.Promise<any>}
   */
  public static getFull(id: string) {
    const defer = q.defer();

    this.get(id)
      .then((tvShow: any) => {
        if (tvShow) {
          tvShow = tvShow.toObject();
          EpisodeDB.findAllByTVShowId(Utils.getId(tvShow))
            .then(items => {
              tvShow.episodesList = items;
              defer.resolve(tvShow);
            })
            .catch(defer.reject);
        } else {
          defer.resolve();
        }
      })
      .catch(defer.reject);

    return defer.promise;
  }

  /**
   * Find show linked to file id
   * @param fid
   * @return {Q.Promise<any>}
   */
  public static findWithFileId(fid): q.Promise<any> {
    const defer = q.defer();

    this._model.find()
      .where('files').in([fid])
      .populate('files')
      .exec((err, item) => {
        if (err) return defer.reject(err);
        defer.resolve(item);
      });

    return defer.promise;
  }

  public static createOrUpdateFromTVDBResult(t: ITVDBShow) {
    const defer = q.defer();

    this._model.findOne()
      .where('tvdbId').equals(t.id)
      .exec((err, item) => {
        const create = !!(err || !item);

        item = item || {};

        if (create) {
          item.title = t.seriesName;
          item.tvdbId = t.id;
          item.imdbId = t.imdbId;
          item.genres = t.genre;
          item.overview = t.overview;
          item.start = t.firstAired ? new Date(t.firstAired) : null;
          item.network = t.network;
        }

        item.banner = `http://thetvdb.com/banners/${t.banner}`;
        item.poster = t.posters ? `http://thetvdb.com/banners/${t.posters[0].fileName}` : null;
        item.posterThumb = t.posters ? `http://thetvdb.com/banners/${t.posters[0].thumbnail}` : null;
        item.actors = _.map(
          _.sortBy(t.actors, (s) => {
            return s.sortOrder;
          }),
          (v) => {
            return {
              tvdbId: v.id,
              name: v.name,
              character: v.role,
              image: v.image ? `http://thetvdb.com/banners/${v.image}` : null
            };
          });
        item.runtime = parseInt(t.runtime);
        item.status = t.status;

        // Set end date if status is Ended.
        if (item.status === 'Ended') {
          let lastDate = null;

          for (const episode of t.episodes) {
            episode.firstAired = new Date(<string>episode.firstAired);
            if (!lastDate || episode.firstAired > lastDate) {
              lastDate = episode.firstAired;
            }
          }

          if (lastDate) {
            item.end = lastDate;
          }
        }

        defer.resolve(create ? this.create(item) : item);
      });

    return defer.promise;
  }
}

TVShowDB.init(tvShowSchema);
module.exports.schema = TVShowDB; // Used by MongoDB models loader (need require)
