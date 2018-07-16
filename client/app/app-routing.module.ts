import {NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {routes} from './routes';
import {AuthService} from 'eygle-core/client/services/auth.service';
import {EygleCoreRoutingModule} from 'eygle-core/client/core-routing.module';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule extends EygleCoreRoutingModule {

  constructor(router: Router, auth: AuthService) {
    super(router, auth);
  }
}
