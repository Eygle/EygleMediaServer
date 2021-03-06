import * as q from 'q';
import * as _ from 'underscore';
import * as moviedb from 'moviedb';

import Utils from 'eygle-core/commons/utils/Utils';
import MovieDB from '../db/MovieDB';
import ALimitedApi from './ALimitedApi';
import {Movie} from '../../commons/models/Movie';

class TMDB extends ALimitedApi {

  /**
   * ConfigDB object
   */
  public config: { images: { base_url: { base_url: string } } };

  constructor() {
    super(true);
    this.api = moviedb(Utils.tmdbToken);
    this.api.configuration((err, res) => {
      this.config = res;
    });
  }

  public get(tmdbId: number, file = null) {
    const defer = q.defer();

    // Check if we already have a movie with this tmdbId
    MovieDB.findOneByTMDBId(tmdbId)
      .then((movie: Movie) => {
        if (!movie) {
          // Fetch movie using API
          this.request('movieInfo', {
            id: tmdbId,
            language: 'fr',
            append_to_response: 'credits,videos'
          })
            .then((res: ITMDBMovie) => defer.resolve(MovieDB.createFromTMDB(res, file)))
            .catch(defer.reject);
        } else {
          file.movie = movie._id;
          if (movie.files) {
            if (movie.files.indexOf(file._id) === -1)
              movie.files.push(file._id);
          } else {
            movie.files = [file._id];
          }
          defer.resolve(movie);
        }
      })
      .catch(defer.reject);

    return defer.promise;
  }

  public searchByTitle(title) {
    const defer = q.defer();

    this.request('searchMovie', {query: title, language: 'fr'})
      .then((res: any) => defer.resolve(res.results))
      .catch(defer.reject);

    return defer.promise;
  }

  /**
   * Return image link closest from size
   * @param type
   * @param width
   * @returns {any}
   */
  public getSizeCloseTo(type, width) {
    switch (type) {
      case 'p':
        type = 'poster_sizes';
        break;
      case 'b':
        type = 'backdrop_sizes';
        break;
      case 'c':
        type = 'profile_sizes';
        break;
    }

    for (const s of this.config.images[type]) {
      if (parseInt(s.substr(1)) >= width) {
        return s;
      }
    }

    return 'original';
  }

  public createAutocompleteFromTMDBResults(movies: Array<ITMDBMovie>) {
    return _.map(movies, (m) => {
      return {
        title: m.title,
        originalTitle: m.original_title,
        date: m.release_date ? new Date(m.release_date) : null,
        poster: m.poster_path ? this.config.images.base_url + this.getSizeCloseTo('p', 50) + m.poster_path : null,
        tmdbId: m.id
      };
    });
  }
}

export interface ITMDBMovie {
  id: number;
  imdb_id: number;
  title: string;
  original_title: string;
  release_date?: string;
  genres?: Array<{ name: string }>;
  overview: string;
  runtime: number;
  vote_count: number;
  vote_average: number;
  budget: number;
  revenue: number;
  poster_path: string;
  backdrop_path: string;
  original_language: string;
  production_countries: Array<{ iso_3166_1: string }>;
  production_companies: Array<{ name: string, id: number }>;
  credits: {
    cast: Array<{ id: number, name: string, character: string, profile_path: string, order: number }>,
    crew: Array<{ id: number, name: string, job: string, profile_path: string, department: string }>
  };
  videos: { results: Array<{ id: number, name: string, key: string, iso_639_1: string, site: string, size: number, type: string }> };

}

export default new TMDB();
