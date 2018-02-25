import TVShowSchema from '../../schemas/TVShow.schema';
import {ARoute} from 'eygle-core/server/middlewares/Resty';
import {EPermission} from 'eygle-core/commons/core.enums';
import {RestyCallback} from 'eygle-core/server/typings/resty.interface';

/**
 * Resource class
 */
class Resource extends ARoute {

  constructor() {
    super(EPermission.SeeTVShows);
  }

  /**
   * Resource PUT Route - Choose a given proposal
   * @param id
   * @param next
   */
  public get(id: string, next: RestyCallback): void {
    TVShowSchema.getFull(id)
      .then(next)
      .catch(next);
  }
}

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.SeeTVShows);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    TVShowSchema.getAll()
      .then(next)
      .catch(next);
  }
}

module.exports.Resource = Resource;
module.exports.Collection = Collection;
