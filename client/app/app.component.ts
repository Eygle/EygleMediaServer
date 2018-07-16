import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {locale as en} from './i18n/en';
import {locale as fr} from './i18n/fr';
import {ConfigService} from 'eygle-core/client/services/config.service';
import {IRouteItem} from 'eygle-core/client/core-routes';
import {routes} from './routes';

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

  constructor(translate: TranslateService, config: ConfigService) {
    // Add languages
    translate.addLangs(['en', 'fr']);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(translate.getBrowserLang());

    // Set the translations
    translate.setTranslation('en', en, true);
    translate.setTranslation('fr', fr, true);

    config.onSettingsChanged
      .subscribe((newSettings) => {
        this.navbar = newSettings.layout.navbar;
        this.toolbar = newSettings.layout.toolbar;
      });

    this.routes = routes;
    console.log(this.routes);
  }
}
