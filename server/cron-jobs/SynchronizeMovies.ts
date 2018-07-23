import * as q from 'q';

import {SynchronizeMedia} from './lib/SynchronizeMedia';
import TMDB, {ITMDBMovie} from '../modules/TMDB';
import MovieDB from '../db/MovieDB';
import ProposalDB from '../db/ProposalDB';
import {LocalFile} from '../../commons/models/LocalFile';
import {Movie} from '../../commons/models/Movie';
import {Proposal} from '../../commons/models/Proposal';
import EMSUtils from '../utils/EMSUtils';

class SynchronizeMovies extends SynchronizeMedia {
  constructor() {
    super(SynchronizeMovies.name, EMSUtils.moviesRoot, 'movies-dump.json', MovieDB);
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

    if (this.media.length) {
      this._addMovieFromFile(this.media.shift())
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
    return true;
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
      this.logger.trace(`TMDB search with title ${file.mediaInfo.title}`);
      TMDB.searchByTitle(file.mediaInfo.title).then((results: Array<ITMDBMovie>) => {
        if (results.length === 0) {
          this.logger.trace('TMDB no results');
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
          this.logger.trace(`[TMDB] Saving ${results.length} matches as proposals`);
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
   * Fetch movie info from TMDB and save in database
   * @param {LocalFile} file
   * @param {number} tmdbId
   * @return {Q.Promise<any>}
   * @private
   */
  private _fetchMovieInfoAndSave(file: LocalFile, tmdbId: number) {
    const defer = q.defer();

    TMDB.get(tmdbId, file.model).then((res: ITMDBMovie) => {
      MovieDB.save(res)
        .then((movie: Movie) => {
          this.logger.log((movie.files.length === 1 ? 'MovieDB added' : 'Linked to existed movie') + ` ${movie.title}`);
          this.nbrMediaAdded++;
          defer.resolve();
        })
        .catch((err) => {
          this.logger.error('[MovieDB] save error', err);
          defer.reject(null);
        });
    }).catch(err => {
      this.logger.error(`Error during movie info fetching (tmdbid: ${tmdbId}`, err);
      defer.reject(err);
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
      promises.push(ProposalDB.save(ProposalDB.createFromTMDBResult(r, file.model))
        .then((proposal: Proposal) =>
          this.logger.log(`Add proposal: ${proposal.title}${proposal.date ? ` (${proposal.date.getFullYear()})` : ''}`))
        .catch(err => this.logger.error('[ProposalDB] save error', err)));
    }

    return q.allSettled(promises);
  }
}

module.exports = new SynchronizeMovies();
