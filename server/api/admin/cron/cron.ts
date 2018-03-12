import {ARoute} from 'eygle-core/server/middlewares/Resty';
import CronJobDB from 'eygle-core/server/db/CronJobDB';
import {EHTTPStatus} from 'eygle-core/server/typings/server.enums';
import {ECronJobAction, EPermission} from 'eygle-core/commons/core.enums';
import CronManager from 'eygle-core/server/modules/CronManager';
import EdError from 'eygle-core/server/utils/EdError';
import {RestyCallback} from 'eygle-core/server/typings/resty.interface';

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.ManageCron);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    CronJobDB.getAll()
      .then(next)
      .catch(next);
  }

  /**
   * Resource PUT Route
   * @param next
   */
  public post(next: RestyCallback): void {
    switch (this.body.action) {
      case ECronJobAction.Run:
        CronManager.runJob(this.body.job);
        break;
      case ECronJobAction.Schedule:
        CronManager.scheduleJob(this.body.job);
        break;
      case ECronJobAction.UnSchedule:
        CronManager.unScheduleJob(this.body.job);
        break;
      default:
        next(new EdError(EHTTPStatus.BadRequest));
        return;
    }
    next();
  }
}

module.exports.Collection = Collection;
