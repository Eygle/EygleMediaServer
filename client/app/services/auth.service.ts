import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

import {User} from "../../../commons/models/user";
import {catchError} from "rxjs/operators";
import {of} from "rxjs/observable/of";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'plain/text'})
};

@Injectable()
export class AuthService {
  /**
   * Current logged user
   */
  user: User;

  constructor(private http: HttpClient) {
    this.user = null;
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
