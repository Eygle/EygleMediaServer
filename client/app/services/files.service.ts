import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EygleFile} from '../../../commons/models/File';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FilesService {
  /**
   * Api url
   */
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = '/api/files';
  }

  /**
   * Get all [[EygleFile]]'s children
   * @returns {Observable<EygleFile>}
   */
  getChildren(parent: string = null): Observable<EygleFile[]> {
    const url = parent ? `${this._api}/${parent}` : this._api;

    return this.http.get<EygleFile[]>(url);
  }
}
