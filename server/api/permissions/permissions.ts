import ConfigSchema from '../../schemas/Config.schema';
import {ARoute} from '../../middlewares/Resty';
import {RestyCallback} from '../../typings/resty.interface';

class Collection extends ARoute {
  /**
   * GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    ConfigSchema.getPermissions()
      .then((items: Array<IPermission>) => {
        next(items);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
}

module.exports.Collection = Collection;
