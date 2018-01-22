import {NgModule} from '@angular/core';
import {NavigationEnd, Router, RouterEvent, RouterModule, Routes} from '@angular/router';

import {FilesComponent} from './files/files.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthService} from './services/auth.service';

const routes: Routes = [
  // { path: '', redirectTo: '/files', pathMatch: 'full' },
  {path: 'files', component: FilesComponent},
  {path: 'auth/login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  /**
   * Checks to perform
   */
  private _checks: Array<{ func: (url: string) => boolean, route: string }>;

  /**
   * Routes not to include in checks
   */
  private _ignoreRoutes: Array<String>;

  constructor(private router: Router, private auth: AuthService) {
    this._checks = [
      {func: this._shouldLogin, route: 'auth/login'},
      {func: this._shouldSeeResetPassword, route: 'auth/reset-password'}
    ];

    // Check if user need redirection on every navigation start
    this.router.events.subscribe(
      (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this._performChecksNRedirects(event.url);
        }
      }
    );
  }

  /**
   * Perform all checks and redirects
   * @private
   * @param url
   * @return {boolean}
   */
  private _performChecksNRedirects(url: string): void {
    this._ignoreRoutes = ['/auth/forgot-password', '/auth/login', '/auth/register'];

    for (const check of this._checks) {
      if (check.func.apply(this, [url])) {
        if (check.route) { // Redirect to url
          console.info('Redirect to route', check.route);
          this.router.navigateByUrl(check.route);
        }
        return;
      }
    }
  }

  /**
   * Should UserSchema be redirected to login view
   * @param url
   * @return {boolean}
   * @private
   */
  private _shouldLogin(url) {
    return !this.auth.isLogged() && !this._urlIn(this._ignoreRoutes, url);
  }

  /**
   * Should UserSchema be redirected to reset password view
   * @param url
   * @return {boolean}
   * @private
   */
  private _shouldSeeResetPassword(url) {
    this._ignoreRoutes.push('/auth/reset-password');
    return !this._urlIn(this._ignoreRoutes, url) && this.auth.user.changePassword;
  }

  /**
   * Is url in exclude list
   * @param exclude
   * @param {string} url
   * @return {number}
   * @private
   */
  private _urlIn(exclude: any, url: string) {
    exclude = exclude instanceof Array ? exclude : [exclude];
    return ~exclude.indexOf(url);
  }
}
