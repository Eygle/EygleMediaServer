import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

import {User} from "../../../commons/models/user";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

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

  constructor(private http: HttpClient, private cookie: CookieService, private router: Router) {
    const json = this.cookie.get("user");
    this.user = json ? JSON.parse(json) : null;
  }

  /**
   * User is logged
   */
  public isLogged(): boolean {
    return !!this.user;
  }

  /**
   * Log in action
   */
  public logIn(username: string, password: string): Observable<User> {
    console.log(username, password);
    return this.http.post<User>("/login", {
      username: username,
      password: password
    }, httpOptions)
      .pipe(
        tap(() => {
          this.user = JSON.parse(this.cookie.get("user"));
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
}
