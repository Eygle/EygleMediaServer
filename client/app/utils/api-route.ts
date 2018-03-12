import * as path from 'path';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export class ApiRoute {

  /**
   * Api route
   */
  private _endPoint: string;

  /**
   * List of options to use per request
   */
  private httpOptions: any;

  constructor(private http: HttpClient, route: string, options: any = {}) {
    this._endPoint = path.join('/api', route);
    this.httpOptions = {};

    for (const m of ['get', 'put', 'delete', 'post']) {
      this.httpOptions[m] = options.hasOwnProperty(m) ? options[m] : {
        headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
        responseType: 'application/json'
      };
    }
  }

  /**
   * Send GET request
   * @param params
   * @returns {Observable<any>}
   */
  public get<T>(params: any = null) {
    const url = this._formatUrl(params);

    return this.http.get<T>(url, this.httpOptions['get'])
      .pipe(
        catchError(this._handleError<T>('GET', url))
      );
  }

  /**
   * Send PUT request
   * @param params
   * @param body
   * @returns {Observable<any>}
   */
  public put<T>(params: any = null, body: any) {
    const url = this._formatUrl(params);

    return this.http.post<T>(url, body, this.httpOptions['put'])
      .pipe(
        catchError(this._handleError<T>('PUT', url))
      );
  }

  /**
   * Send DELETE request
   * @param params
   * @param body
   * @returns {Observable<any>}
   */
  public delete<T>(params: any = null, body: any) {
    const url = this._formatUrl(params);

    return this.http.post<T>(url, body, this.httpOptions['delete'])
      .pipe(
        catchError(this._handleError<T>('DELETE', url))
      );
  }

  /**
   * Send POST request
   * @param params
   * @param body
   * @returns {Observable<any>}
   */
  public post<T>(params: any = null, body: any) {
    const url = this._formatUrl(params);

    return this.http.post<T>(url, body, this.httpOptions['post'])
      .pipe(
        catchError(this._handleError<T>('POST', url))
      );

  }

  /**
   * Handle error
   * @private
   */
  private _handleError<T>(method: string, url: string, result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`[${method}] ${url}`, error); // log to console instead

      // // TODO: better job of transforming error for user consumption
      // this.log(`${url} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Format url and replace all params
   *   ie:
   *      _endPoint = '/route/:parentId/:id'
   *      params    = {parentId: 'foo', id: 'bar'}
   *      result    = '/route/foo/bar'
   * @param params
   * @returns {string}
   * @private
   */
  private _formatUrl(params: any) {
    if (!params)
      return this._endPoint;

    let url = this._endPoint;

    for (let i in params) {
      if (params.hasOwnProperty(i)) {
        url = url.replace(`:${i}`, params[i]);
      }
    }

    url.replace(/\:[a-zA-Z0-9-_]+/g, '');

    return url;
  }
}
