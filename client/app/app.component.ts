import {Component} from '@angular/core';

import {locale as fr} from './i18n/fr';
import {ConfigService} from 'eygle-core/client/services/config.service';
import {routes} from './routes';
import {LangService} from 'eygle-core/client/services/lang.service';
import {IRouteItem} from 'eygle-core/client/typings/route-item.interface';

@Component({
  selector: 'ems-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * Do page include navbar?
   */
  navbar: boolean;

  /**
   * Do page include toolbar?
   */
  toolbar: boolean;

  /**
   * List of routes
   */
  routes: IRouteItem[];

  constructor(langService: LangService, config: ConfigService) {
    langService.init(fr); // TODO add en ?

    config.onSettingsChanged
      .subscribe((newSettings) => {
        this.navbar = newSettings.layout.navbar;
        this.toolbar = newSettings.layout.toolbar;
      });

    this.routes = routes;
  }
}
