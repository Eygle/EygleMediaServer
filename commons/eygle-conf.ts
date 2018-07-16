import {ELoggerLvl} from 'eygle-core/commons/core.enums';

const config: any = {
  'appName': 'Eygle Media Server',

  implementsAuth: true,
  includeCronManager: true,
  debug: false,

  server: {
    'port': 4242,
    'dbName': 'eygle',
    'dbCollectionsPrefix': 'EMS_',
    'sessionCookieName': 'eygle-connect.sid',
    'includeEmailUnsubscribe': true,
    'activateCSRFSecurity': true,
  },
  client: {
    development: {
      loggerLvl: ELoggerLvl.TRACE
    }
  }
};

module.exports = config;
