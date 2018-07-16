import {ARoute} from 'eygle-core/server/middlewares/Resty';
import {EPermission} from 'eygle-core/commons/core.enums';
import {RestyCallback} from 'eygle-core/server/typings/resty.interface';
import UserDB from 'eygle-core/server/db/UserDB';

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.EditUsers);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    UserDB.getAll({select: '+roles', sort: {creationDate: -1}})
      .then(next)
      .catch(next);
  }
}

module.exports.Collection = Collection;
