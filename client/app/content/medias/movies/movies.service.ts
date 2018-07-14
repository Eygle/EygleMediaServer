import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {HttpClient} from '@angular/common/http';
import {Movie} from '../../../../../commons/models/Movie';

@Injectable()
export class MoviesService {
  /**
   * Api url
   */
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = '/api/movies';
  }

  /**
   * Get all movies
   * @return {Observable<[Movie]>}
   */
  public getAll() {
    return this.http.get<[Movie]>(this._api).map(res => {
      return this._formatApiData(res);
    });
  }

  /**
   *
   * @param {string} id
   * @returns {Observable<Movie>}
   */
  public getById(id: string) {
    return this.http.get<Movie>(`${this._api}/${id}`).map(res => {
      return this._formatApiData(res);
    });
  }

  /**
   * Format movie data
   * @param {Movie | Movie[]} movies
   * @private
   */
  private _formatApiData(movies: Movie | Movie[]) {
    let isArray = true;
    if (!Array.isArray(movies)) {
      movies = [movies];
      isArray = false;
    }

    for (const movie of movies) {
      if (movie.date) {
        movie.date = new Date(movie.date);
      }
    }

    return isArray ? movies : movies[0];
  }
}
