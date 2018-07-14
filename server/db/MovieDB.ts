import * as q from 'q';
import * as _ from 'underscore';
import TMDB, {ITMDBMovie} from '../modules/TMDB';
import {EygleFile} from '../../commons/models/File';
import ADBModel from 'eygle-core/server/db/ADBModel';
import {movieSchema} from '../schemas/movie.schema';

export default class MovieDB extends ADBModel {
  /**
   * Find one by tmdbId
   * @param {number} tmdbId
   */
  public static findOneByTMDBId(tmdbId: number) {
    const defer = q.defer();

    this._model.findOne()
      .where('tmdbId', tmdbId)
      .exec((err, item) => {
        if (err) return defer.reject(err);
        defer.resolve(item);
      });

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

  /**
   * Create movie from TMDB result
   * @param {ITMDBMovie} m
   * @param {EygleFile} file
   * @returns {Movie}
   */
  public static createFromTMDB(m: ITMDBMovie, file: EygleFile = null) {
    const movie: any = this.create({
      title: m.title,
      originalTitle: m.original_title,
      date: m.release_date ? new Date(m.release_date) : null,
      genres: _.map(m.genres, (v) => {
        return v.name;
      }),
      overview: m.overview,
      runtime: m.runtime,
      voteCount: m.vote_count,
      voteAverage: m.vote_average,
      budget: m.budget,
      revenue: m.revenue,
      posterThumb: m.poster_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('p', 154) + m.poster_path : null,
      poster: m.poster_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('p', 1000) + m.poster_path : null,
      backdrop: m.backdrop_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('b', 2000) + m.backdrop_path : null,
      originalLanguage: m.original_language,
      countries: _.map(m.production_countries, (v) => {
        return v.iso_3166_1;
      }),

      cast: _.map(_.filter(m.credits.cast, (v) => {
        return v.order <= 15;
      }), (v) => {
        return {
          tmdbId: v.id,
          name: v.name,
          character: v.character,
          image: v.profile_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('c', 138) + v.profile_path : null
        };
      }),
      crew: _.map(_.filter(m.credits.crew, (v) => {
        return v.department === 'Directing' || v.department === 'Writing';
      }), (v) => {
        return {
          tmdbId: v.id,
          name: v.name,
          job: v.job,
          image: v.profile_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('c', 138) + v.profile_path : null
        };
      }),

      videos: _.map(m.videos.results, (v) => {
        return {
          id: v.id,
          lang: v.iso_639_1,
          key: v.key,
          name: v.name,
          site: v.site ? v.site.toLowerCase() : null,
          size: v.size,
          videoType: v.type
        };
      }),

      tmdbId: m.id,
      imdbId: m.imdb_id,
    });

    if (file) {
      file.movie = movie._id;
      movie.files = [file._id];
    }

    return movie;
  }
}

MovieDB.init(movieSchema);
module.exports.schema = MovieDB; // Used by MongoDB models loader (need require)
