import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TVShow} from "../../../../../commons/models/TVShow";

@Injectable()
export class TvShowsService {
  /**
   * Api url
   */
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = '/api/tv-shows';
  }


  /**
   * Get all tv shows
   * @return {Observable<[TVShow]>}
   */
  public getAll(limit: number = null) {
    const url = limit ? `${this._api}/?limit=${limit}` : this._api;
    return this.http.get<[TVShow]>(url).map(res => {
      return res;
    });
  }
}
