import ConfigSchema from '../../core/schemas/Config.schema';
import {ARoute} from '../../core/middlewares/Resty';
import {RestyCallback} from '../../core/typings/resty.interface';
import {Permission} from '../../core/models/Config';

class Collection extends ARoute {
  /**
   * GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    ConfigSchema.getPermissions()
      .then((items: Array<Permission>) => {
        next(items);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
}

module.exports.Collection = Collection;
