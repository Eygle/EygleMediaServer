import * as fs from 'fs';
import * as q from 'q';
import * as path from 'path';
import * as _ from 'underscore';
import * as ptn from 'parse-torrent-name';

import AJob from '../core/models/AJob';
import Utils from '../core/config/Utils';
import FileSchema from '../schemas/File.schema';
import TMDB, {ITMDBMovie} from '../modules/TMDB';
import MovieSchema from '../schemas/Movie.schema';
import ProposalSchema from '../schemas/Proposal.schema';
import TVDB, {ITVDBEpisode, ITVDBShow} from '../modules/TVDB';
import TVShowSchema from '../schemas/TVShow.schema';
import EpisodeSchema from '../schemas/Episode.schema';
import {EEnv} from '../core/typings/server.enums';
import {EygleFile} from '../../commons/models/File';
import {Episode} from '../../commons/models/Episode';
import {LocalFile} from '../../commons/models/LocalFile';
import {Movie} from '../../commons/models/Movie';
import {Proposal} from '../../commons/models/Proposal';
import {TVShow} from '../../commons/models/TVShow';


class SynchronizeMedias extends AJob {
  /**
   * List of local files to process and add in database
   */
  private _filesToAdd: Array<LocalFile>;

  /**
   * List of files not present anymore to remove from database
   */
  private _filesToDelete: Array<LocalFile>;

  /**
   * List of local files identified as movies
   */
  private _movies: Array<LocalFile>;

  /**
   * List of local files identified as tv shows
   */
  private _tvShows: Array<LocalFile>;

  /**
   * List of local tvshows files grouped by show and season
   */
  private _tvShowsGrouped: any;

  /**
   * Number of movies added
   */
  private _nbrMoviesAdded: number;

  /**
   * Number of tv shows added
   */
  private _nbrTVShowsAdded: number;

  /**
   * Number of files added
   */
  private _nbrFilesAdded: number;

  /**
   * Number of files deleted
   */
  private _nbrFilesDeleted: number;

  /**
   * Dump JSON file path
   */
  private _dumpPath: string;

  /**
   * List of videos extensions
   */
  private _videoExtensions: Array<string>;

  constructor() {
    super(SynchronizeMedias.name);
    this.scheduleRule = '* * * * *';
    this.environments = [EEnv.Prod];

    this._dumpPath = `${Utils.filesRoot}/dl-files-dump.json`;
    this._videoExtensions = ['.avi', '.mkv', '.webm', '.flv', '.vob', '.ogg', '.ogv', '.mov', '.qt',
      '.wmv', '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv'];
  }

  /**
   * Run service
   */
  public run(): void {
    super.run();

    this._filesToAdd = [];
    this._movies = [];
    this._tvShows = [];
    this._nbrMoviesAdded = 0;
    this._nbrTVShowsAdded = 0;
    this._nbrFilesAdded = 0;
    this._nbrFilesDeleted = 0;

    this._synchronize()
      .finally(() => this.end());
  }

  /**
   * Get full list of local files
   * Compare to previous list
   * Save new medias
   * Remove deleted medias
   */
  private _synchronize() {
    const defer = q.defer();
    const previous = EEnv.Dev === Utils.env ? [] : this._load();
    const files: Array<LocalFile> = EEnv.Dev === Utils.env ? this._load() : this._listDirectory(`${Utils.filesRoot}/downloads`);

    this._dump(files); // dump as soon as possible to avoid having two time the same task running on the same medias
    for (const f of files) {
      const idx = _.findIndex(previous, (o: LocalFile) => {
        return o.filename === f.filename && o.size === f.size && o.path === f.path;
      });

      if (!~idx) {
        this._filesToAdd.push(f);
      } else {
        previous.splice(idx, 1);
      }
    }
    // Add remaining files (not present anymore) to files to delete list
    this._filesToDelete = previous;

    this._identifyMedias();
    this._tvShowsGrouped = this._mergeTVShowList(this._tvShows);
    this._processFilesToAddSynchronously()
      .then(() => this._processFilesToDelete()
        .then(() => this._saveNewFiles()
          .then(() => {
            this.logger.info(`${this._nbrMoviesAdded} movies added`);
            this.logger.info(`${this._nbrTVShowsAdded} tv shows added`);
            this.logger.info(`${this._nbrFilesAdded} files added`);
            this.logger.info(`${this._nbrFilesDeleted} files deleted`);
            defer.resolve();
          }).catch(defer.reject)
        ).catch(defer.reject)
      ).catch(defer.reject);

    return defer.promise;
  }

  /**
   * Identify medias and create IFiles
   * @param {Array<LocalFile>} list
   * @param {EygleFile} parent
   * @return {any}
   * @private
   */
  private _identifyMedias(list = this._filesToAdd, parent: EygleFile = null) {
    for (const f of list) {
      f.parent = parent ? parent._id.toString() : null;
      f.model = FileSchema.create(f);
      if (f.directory && f.children) {
        this._identifyMedias(f.children, f.model);
      } else {
        if (this._isVideo(f.filename)) {
          if (!f.mediaInfo) {
            f.mediaInfo = ptn(f.filename);
          }
          if (!f.mediaInfo.title) continue;

          const fullPath = f.path ? `${f.path}/${f.filename}` : f.filename;
          if (this._isTVShow(fullPath)) {
            if (f.mediaInfo.hasOwnProperty('episode') && f.mediaInfo.hasOwnProperty('season')) {
              this._tvShows.push(f);
            }
          } else {
            this._movies.push(f);
          }
        }
      }
    }
  }

  /**
   * Add all new files to database and extract medias if possible
   * Remove all files to delete
   * @return {Q.Promise<any>}
   * @private
   */
  private _processFilesToAddSynchronously(defer = null) {
    if (!defer) {
      defer = q.defer();
    }

    if (this._movies.length) {
      this._addMovieFromFile(this._movies.shift())
        .finally(() => this._processFilesToAddSynchronously(defer));
    } else if (this._tvShowsGrouped.length) {
      const show = this._tvShowsGrouped.shift();
      const k = Object.keys(show)[0];
      this._addTVShow(k, show[k])
        .finally(() => this._processFilesToAddSynchronously(defer));
    } else {
      defer.resolve();
    }

    return defer.promise;
  }

  /**
   * Delete all filesToDelete from database and the linked media
   * @return {Q.Promise<any>}
   * @private
   */
  private _processFilesToDelete() {
    const promises = [];

    for (const f of this._filesToDelete) {
      const defer = q.defer();
      let movie, tvShow = null;

      q.allSettled([
        FileSchema.remove(f.model),
        MovieSchema.findWithFileId(f.model._id).then(res => {
          movie = res;
        }),
        TVShowSchema.findWithFileId(f.model._id).then(res => {
          tvShow = res;
        })
      ]).then(() => {
        if (movie) {
          MovieSchema.setDeletedById(movie)
            .then(() => defer.resolve())
            .catch((err) => defer.reject(err));
        } else if (tvShow) {
          TVShowSchema.setDeletedById(movie)
            .then(() => defer.resolve())
            .catch((err) => defer.reject(err));
        } else {
          defer.resolve();
        }
      }).catch((err) => defer.reject(err));
      this._nbrFilesDeleted++;

      promises.push(defer.promise);
    }

    return q.allSettled(promises);
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
   * Add movie from local file
   * @private
   * @param file
   */
  private _addMovieFromFile(file: LocalFile) {
    const defer = q.defer();

    this.logger.log(`Process movie from file ${file.filename}`);
    if (file.mediaInfo.title) {
      TMDB.searchByTitle(file.mediaInfo.title).then((results: Array<ITMDBMovie>) => {
        if (results.length === 0) {
          defer.resolve();
        } else if (results.length === 1) {
          this._fetchMovieInfoAndSave(file, results[0].id)
            .then(defer.resolve)
            .catch(defer.reject);
        } else {
          if (file.mediaInfo.year) {
            for (const m of results) {
              if (m.release_date && new Date(m.release_date).getFullYear() === file.mediaInfo.year) {
                this._fetchMovieInfoAndSave(file, m.id)
                  .then(defer.resolve)
                  .catch(defer.reject);
                return defer.promise;
              }
            }
          }
          this._addMoviesProposals(results, file)
            .then(defer.resolve)
            .catch(defer.reject);
        }
      }).catch(err => {
        this.logger.error('[TMDB:searchByTitle] error', err);
        defer.reject(null);
      });
    } else {
      this.logger.warn(`Skipped ${file.filename}: no exploitable title`);
      defer.reject(null);
    }

    return defer.promise;
  }

  /**
   * Add TVShowSchema
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
          // insert unique TVShowSchema & all episodes
          TVDB.get(res[0].id)
            .then(res2 => {
              TVShowSchema.createOrUpdateFromTVDBResult(res2)
                .then((item: TVShow) => {
                  TVShowSchema.save(item)
                    .then(() => {
                      this.logger.log(`Added/updated TVShow: ${item.title}`);
                      this._nbrTVShowsAdded++;
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
        this.logger.log('[TVDB] error:', err);
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

              EpisodeSchema.createOrUpdateFromTVDBResult(show, ep, filesPerSeasons[season][episode])
                .then((res: Episode) => {
                  EpisodeSchema.save(res)
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

  /**
   * Fetch movie info from TMDB and save in database
   * @param {LocalFile} file
   * @param {number} tmdbId
   * @return {Q.Promise<any>}
   * @private
   */
  private _fetchMovieInfoAndSave(file: LocalFile, tmdbId: number) {
    const defer = q.defer();

    TMDB.get(tmdbId, file.model).then((res: ITMDBMovie) => {
      MovieSchema.save(res)
        .then((movie: Movie) => {
          this.logger.log((movie.files.length === 1 ? 'MovieSchema added' : 'Linked to existed movie') + ` ${movie.title}`);
          this._nbrMoviesAdded++;
          defer.resolve();
        })
        .catch((err) => {
          this.logger.error('[MovieSchema] save error', err);
          defer.reject(null);
        });
    });
    return defer.promise;
  }

  /**
   * Add all movies proposals
   * @param {Array<ITMDBMovie>} results
   * @param {LocalFile} file
   * @return {Q.Promise<Array<Q.PromiseState<any>>>}
   * @private
   */
  private _addMoviesProposals(results: Array<ITMDBMovie>, file: LocalFile) {
    const promises = [];

    for (const r of results) {
      promises.push(ProposalSchema.save(ProposalSchema.createFromTMDBResult(r, file.model))
        .then((proposal: Proposal) =>
          this.logger.log(`Add proposal: ${proposal.title}${proposal.date ? ` (${proposal.date.getFullYear()})` : ''}`))
        .catch(err => this.logger.error('[ProposalSchema] save error', err)));
    }

    return q.allSettled(promises);
  }

  /**
   * Save all new [[IFile]]s
   * @return {Q.Promise<Array<Q.PromiseState<any>>>}
   * @private
   */
  private _saveNewFiles(files = this._filesToAdd) {
    const promises = [];

    for (const f of files) {
      if (f.model) {
        promises.push(FileSchema.save(f.model));
        this._nbrFilesAdded++;
      }
      if (f.children) {
        promises.push(this._saveNewFiles(f.children));
      }
    }

    return q.allSettled(promises);
  }

  /**
   * List directory files
   * @param dir
   * @param {any} parent
   * @param {any} filePath
   * @return {LocalFile[]} full hierarchy
   * @private
   */
  private _listDirectory(dir, filePath = null) {
    return _.map(fs.readdirSync(dir), (f) => {
      const filename = path.join(dir, f);
      const stats = fs.statSync(filename);
      const file: LocalFile = <LocalFile>{
        filename: f,
        directory: stats.isDirectory(),
        mtime: stats.mtime,
        path: filePath
      };
      if (stats.isDirectory()) {
        file.children = this._listDirectory(filename, filePath ? filePath + '/' + f : f);
        file.size = this._filesSize(file.children);
      } else {
        file.ext = path.extname(f);
        file.size = stats.size;
      }

      return file;
    });
  }

  /**
   * Check if file is a video using it's path extension
   * @param filename
   * @returns {boolean}
   */
  private _isVideo(filename: string) {
    return this._videoExtensions.indexOf(path.extname(filename)) !== -1;
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
   * Return size of a given directory
   * @param files
   * @return {number}
   * @private
   */
  private _filesSize(files) {
    return _.reduce(files, (memo: number, f: LocalFile) => {
      return memo + f.size;
    }, 0);
  }

  /**
   * Dump full files list into a local JSON file
   */
  private _dump(data: Array<LocalFile>) {
    fs.writeFileSync(this._dumpPath, JSON.stringify(data));
  }

  /**
   * Load previous full files list from local JSON file
   */
  private _load() {
    if (!fs.existsSync(this._dumpPath)) {
      return [];
    }

    const json = <any>fs.readFileSync(this._dumpPath);
    return json ? JSON.parse(json) : [];
  }
}

module.exports = new SynchronizeMedias();
