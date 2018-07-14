import AJob from 'eygle-core/server/models/AJob';
import TVDB from '../modules/TVDB';
import {EEnv} from 'eygle-core/commons/core.enums';


class TestTVDBApi extends AJob {

  constructor() {
    super(TestTVDBApi.name);
    this.scheduleRule = '* * * * *';
    this.environments = [EEnv.Prod];
  }

  /**
   * Run service
   */
  public run(): void {
    super.run();

    for (const title of [
      'a series of unfortunate events',
      'family guy',
      'the last man on earth',
      'suits'
    ]) {
      TVDB.searchByTitle(title)
        .then(() => this.logger.log(title, 'OK'))
        .catch((err) => this.logger.error(title, 'KO'));
    }

    this.end();
  }

  public clean() {

  }
}

module.exports = new TestTVDBApi();
