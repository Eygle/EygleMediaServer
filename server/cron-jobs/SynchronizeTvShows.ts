import * as q from 'q';
import * as ptn from 'parse-torrent-name';

import {SynchronizeMedia} from './lib/SynchronizeMedia';
import EMSUtils from '../utils/EMSUtils';
import {LocalFile} from '../../commons/models/LocalFile';
import TVShowDB from '../db/TVShowDB';
import EpisodeDB from '../db/EpisodeDB';
import TVDB, {ITVDBEpisode, ITVDBShow} from '../modules/TVDB';
import {TVShow} from '../../commons/models/TVShow';
import {Episode} from '../../commons/models/Episode';

class SynchronizeTvShows extends SynchronizeMedia {
  /**
   * List of tv shows grouped by name
   */
  private _tvShowsGrouped: LocalFile[];

  constructor() {
    super(SynchronizeTvShows.name, EMSUtils.tvShowsRoot, 'tv-shows-dump.json', TVShowDB);
  }

  /**
   * Add all new files to database and extract media if possible
   * Remove all files to delete
   * @return {Q.Promise<any>}
   * @private
   */
  protected processFilesToAddSynchronously(defer = null) {
    if (!defer) {
      defer = q.defer();
    }
    if (!this._tvShowsGrouped) {
      this._tvShowsGrouped = this._mergeTVShowList(this.media);
    }

    if (this._tvShowsGrouped.length) {
      const show = this._tvShowsGrouped.shift();
      const k = Object.keys(show)[0];
      this._addTVShow(k, show[k])
        .finally(() => this.processFilesToAddSynchronously(defer));
    } else {
      defer.resolve();
    }

    return defer.promise;
  }

  /**
   * Add check if needed for given LocalFile
   * @param {} f
   * @return {boolean}
   */
  protected isValidMedia(f: LocalFile): boolean {
    const fullPath = f.path ? `${f.path}/${f.filename}` : f.filename;
    if (this._isTVShow(fullPath)) {
      if (f.mediaInfo.hasOwnProperty('episode') && f.mediaInfo.hasOwnProperty('season')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Merge tvshow episodes and seasons into shows
   * @param {Array<LocalFile>} files
   * @return {{}}
   * @private
   */
  private _mergeTVShowList(files: Array<LocalFile>) {
    const tvshows = {};
    const res = [];

    for (const f of files) {
      const title = f.mediaInfo.title.toLowerCase();
      if (!tvshows.hasOwnProperty(title)) {
        const r = {};
        tvshows[title] = {};
        r[title] = tvshows[title];
        res.push(r);
      }
      if (!tvshows[title].hasOwnProperty(f.mediaInfo.season))
        tvshows[title][f.mediaInfo.season] = {};
      if (!tvshows[title][f.mediaInfo.season].hasOwnProperty(f.mediaInfo.episode))
        tvshows[title][f.mediaInfo.season][f.mediaInfo.episode] = [f.model];
      else
        tvshows[title][f.mediaInfo.season][f.mediaInfo.episode].push(f.model);
    }

    return res;
  }

  /**
   * Check if path relate to a tv show using it's full path (the info can be in the parent folder)
   * @param p
   * @return {any}
   */
  private _isTVShow(p) {
    const files = p.split('/');

    for (const f of files) {
      const info = ptn(f);
      if (info.season || info.episode)
        return true;
    }

    return files.length > 1 && files[files.length - 2].match(/(seasons?|saisons?)/i);
  }

  /**
   * Add TVShowDB
   * @param {string} title
   * @param show
   * @return {Q.Promise<any>}
   * @private
   */
  private _addTVShow(title: string, show: any) {
    const defer = q.defer();

    this.logger.log(`Process tv show with title ${title}`);
    TVDB.searchByTitle(title)
      .then((res: Array<ITVDBShow>) => {
        if (res.length === 1) {
          // insert unique TVShowDB & all episodes
          TVDB.get(res[0].id)
            .then(res2 => {
              TVShowDB.createOrUpdateFromTVDBResult(res2)
                .then((item: TVShow) => {
                  TVShowDB.save(item)
                    .then(() => {
                      this.logger.log(`Added/updated TVShow: ${item.title}`);
                      this.nbrMediaAdded++;
                      this._addAllEpisodes(item, res2.episodes, show).then(() => {
                        defer.resolve();
                      });
                    })
                    .catch(err => {
                      this.logger.error(err);
                      defer.reject(null);
                    });
                });
            })
            .catch((err) => {
              this.logger.error(`Impossible to fetch TVShow id:${res[0].id} from TVDB`, err);
              defer.resolve();
            });
        } else if (res.length > 1) {
          this.logger.log(`Multiple TVShows results found for title: ${title}`);
          defer.resolve();
        } else {
          this.logger.log(`[TVDB] No result found for title: ${title}`);
          defer.resolve();
        }
      })
      .catch(err => {
        this.logger.log('[TVDB] error:', err.message);
        defer.reject(null);
      });

    return defer.promise;
  }

  /**
   * Add all show episodes
   * @param {TVShow} show
   * @param {Array<ITVDBEpisode>} episodesList
   * @param filesPerSeasons
   * @return {Q.Promise<Array<Q.PromiseState<any>>>}
   * @private
   */
  private _addAllEpisodes(show: TVShow, episodesList: Array<ITVDBEpisode>, filesPerSeasons: any) {
    const promises = [];

    for (const season in filesPerSeasons) {
      if (filesPerSeasons.hasOwnProperty(season)) {
        for (const episode in filesPerSeasons[season]) {
          if (filesPerSeasons[season].hasOwnProperty(episode)) {
            const ep = this._findEpisodeFromList(episodesList, parseInt(season), parseInt(episode));
            if (ep) {
              const d = q.defer();
              promises.push(d.promise);

              EpisodeDB.createOrUpdateFromTVDBResult(show, ep, filesPerSeasons[season][episode])
                .then((res: Episode) => {
                  EpisodeDB.save(res)
                    .then(() => {
                      this.logger.log(`Added S${res.season}E${res.number}`);
                      d.resolve();
                    })
                    .catch(err => {
                      this.logger.error('Mongo', err);
                      d.resolve();
                    });
                })
                .catch(err => {
                  this.logger.error('Mongo', err);
                  d.resolve();
                });
            } else {
              this.logger.warn(`S${season}E${episode} not found in TVDB episodes list`);
            }
          }
        }
      }
    }

    return q.allSettled(promises);
  }

  /**
   * Find episode from list
   * @param {Array<ITVDBEpisode>} list
   * @param {number} s
   * @param {number} e
   * @return {any}
   * @private
   */
  private _findEpisodeFromList(list: Array<ITVDBEpisode>, s: number, e: number) {
    for (const v of list) {
      if (v.airedSeason === s && v.airedEpisodeNumber === e) {
        return v;
      }
    }
    return null;
  }
}

module.exports = new SynchronizeTvShows();
