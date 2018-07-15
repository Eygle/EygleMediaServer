import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {EygleFile} from '../../../../../commons/models/File';
import {ApiRoute} from "../../../utils/api-route";

// const httpOptions = {
//   headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
//   responseType: 'text'
// };

@Injectable()
export class FilesService {

  /**
   * File api
   */
  private _api: ApiRoute;

  /**
   * File downloading url
   */
  private _dlApi: ApiRoute;

  constructor(http: HttpClient) {
    this._api = new ApiRoute(http, '/api/files/:parent');
    this._dlApi = new ApiRoute(http, '/dl/:id');
  }

  /**
   * Get all [[EygleFile]]'s children
   * @returns {Observable<[EygleFile]>}
   */
  getChildren(parent: string = null): Observable<EygleFile[]> {
    return this._api.get<EygleFile[]>({parent: parent});
  }

  /**
   * Download single file
   * @param {string} id
   */
  download(id: string) {
    this._dlFileProgramatically(this._dlApi.formatUrl({id: id}));
  }

  /**
   * Download multiple files
   * @param {[EygleFile]} files
   */
  downloadMultiple(files: EygleFile[] | string[]) {
    this._dlApi.post(null, {files: files})
      .subscribe((data: any) => {
        this._dlFileProgramatically(data.url);
      });
  }

  /**
   * Create an 'a' tag and click on it programatically
   * @param url
   * @private
   */
  private _dlFileProgramatically(url: string) {
    const linkElement = document.createElement('a');
    const clickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': false
    });

    linkElement.setAttribute('href', url);
    linkElement.setAttribute('target', '_blank');
    linkElement.dispatchEvent(clickEvent);
  }
}
