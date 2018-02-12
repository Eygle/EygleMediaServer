import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {User} from '../../../commons/core/models/User';
import {ERole} from '../../../commons/core/core.enums';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";
import {ApiRoute} from "../utils/api-route";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
  responseType: 'text'
};

@Injectable()
export class AuthService {

  /**
   * Current logged user
   */
  user: User;

  /**
   * List of permissions
   */
  private _allPermissions: [any];

  /**
   * Permissions API
   */
  private _permApi: ApiRoute;

  constructor(private http: HttpClient, private cookie: CookieService, private router: Router) {
    this.user = this._getObjectFromCookie('user');
    this._allPermissions = this._getObjectFromCookie('permissions');
    this._permApi = new ApiRoute(this.http, '/permissions');

    if (!environment.production) {
      // If not in prod express is not used to serve the client and thus the 'user' and 'permissions' cookies are not transmitted in the index.html page
      this._permApi.get()
        .subscribe((permissions: [any]) => {
          this._allPermissions = permissions;
          this.cookie.set('permissions', JSON.stringify(permissions));
          // The 'permissions' route return user as cookie in DEV mode
          this.user = this._getObjectFromCookie('user');
        });
    }
  }

  /**
   * User is logged
   */
  public isLogged(): boolean {
    return !!this.user;
  }

  /**
   * User is guest
   */
  public isGuest(): boolean {
    return this.isLogged() && this.user.roles.length === 1 && this.user.roles[0] === ERole.Guest;
  }

  /**
   * Does user has requested permission
   * @param accessLevel
   * @param {User} user
   * @return {boolean}
   */
  public authorize = (accessLevel, user: User = null) => {
    const memberRights = user && user.roles ? user.roles : this.user.roles || [ERole.Guest];

    if (!!~memberRights.indexOf(ERole.Admin)) {
      return true;
    }
    if (!this._allPermissions || !this._allPermissions.length) {
      return false;
    }

    for (const perm of this._allPermissions) {
      if (perm.name === accessLevel) {
        for (const m of memberRights) {
          if (!!~perm.roles.indexOf(m)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  /**
   * Log in action
   */
  public logIn(email: string, password: string): Observable<User> {
    return this.http.post<User>('/login', {
      email: email,
      password: password
    }, <{}>httpOptions)
      .pipe(
        tap(() => {
          this.user = JSON.parse(this.cookie.get('user'));
          console.log(this.user);
          this.router.navigate(['files']);
        }),
        catchError(this._handleError<User>('login'))
      );
  }

  /**
   * Register action
   */
  public register(email: string, password: string, username: string): Observable<User> {
    return this.http.post<User>('/register', {
      email: email,
      username: username,
      password: password
    }, <{}>httpOptions)
      .pipe(
        tap(() => {
          this.user = JSON.parse(this.cookie.get('user'));
          console.log(this.user);
          this.router.navigate(['files']);
        }),
        catchError(this._handleError<User>('login'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private _handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Get object from cookie
   * @param {string} key
   * @private
   */
  private _getObjectFromCookie(key: string) {
    const json = this.cookie.get(key);

    return json ? JSON.parse(json) : null;
  }
}
