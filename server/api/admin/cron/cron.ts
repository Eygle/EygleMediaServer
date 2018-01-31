import {ARoute} from '../../../core/middlewares/Resty';
import CronJobSchema from '../../../core/schemas/CronJob.schema';
import {EHTTPStatus, EPermission} from '../../../core/typings/server.enums';
import CronManager from '../../../core/modules/CronManager';
import EdError from '../../../core/config/EdError';
import {RestyCallback} from '../../../core/typings/resty.interface';

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
    CronJobSchema.getAll()
      .then(next)
      .catch(next);
  }

  /**
   * Resource PUT Route
   * @param next
   */
  public post(next: RestyCallback): void {
    switch (this.body.action) {
      case 'run':
        CronManager.runJob(this.body.job);
        break;
      case 'schedule':
        CronManager.scheduleJob(this.body.job);
        break;
      case 'un-schedule':
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
