import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import 'hammerjs';
import {EEnv} from 'eygle-core/commons/core.enums';

declare var require: any;
const env = require('./environments/environment');

if (EEnv.Prod === env) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
