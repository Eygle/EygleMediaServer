import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import ClientConfig from 'eygle-core/client/utils/ClientConfig';
import 'hammerjs';

declare var require: any

// Must set client environment
ClientConfig.init(require('../commons/eygle-conf'), environment.production);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
