import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EygleFile} from '../../../commons/models/File';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
  responseType: 'text'
};

@Injectable()
export class FilesService {
  /**
   * Api url
   */
  private _api: string;

  /**
   * File downloading url
   */
  private _dlUrl: string;

  constructor(private http: HttpClient) {
    this._api = '/api/files';
    this._dlUrl = '/dl'
  }

  /**
   * Get all [[EygleFile]]'s children
   * @returns {Observable<[EygleFile]>}
   */
  getChildren(parent: string = null): Observable<[EygleFile]> {
    const url = parent ? `${this._api}/${parent}` : this._api;

    return this.http.get<[EygleFile]>(url);
  }

  /**
   * Download single file
   * @param {string} id
   */
  download(id: string) {
    window.open(`${this._dlUrl}/${id}`, '_blank');
  }

  /**
   * Download multiple files
   * @param {[EygleFile]} files
   */
  downloadMultiple(files: [EygleFile]) {
    this.http.post(`${this._dlUrl}/`, {files: files}, <{}>httpOptions)
      .subscribe((data: any) => {
        window.open(data.url, '_blank');
      });
  }
}
