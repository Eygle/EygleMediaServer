import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
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
    return this.http.get<[Movie]>(this._api);
  }
}
