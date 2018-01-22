import {ARoute} from '../../../middlewares/Resty';
import CronJobSchema from '../../../schemas/CronJob.schema';
import {EHTTPStatus, EPermission} from '../../../typings/enums';
import CronManager from '../../../cron/CronManager';
import EdError from '../../../config/EdError';
import {RestyCallback} from '../../../typings/resty.interface';

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
    switch (this.data.action) {
      case 'run':
        CronManager.runJob(this.data.job);
        break;
      case 'schedule':
        CronManager.scheduleJob(this.data.job);
        break;
      case 'un-schedule':
        CronManager.unScheduleJob(this.data.job);
        break;
      default:
        next(new EdError(EHTTPStatus.BadRequest));
        return;
    }
    next();
  }
}

module.exports.Collection = Collection;
