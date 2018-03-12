import FileDB from '../../db/FileDB';
import {ARoute} from 'eygle-core/server/middlewares/Resty';
import {EPermission} from 'eygle-core/commons/core.enums';
import {RestyCallback} from 'eygle-core/server/typings/resty.interface';
import {EygleFile} from '../../../commons/models/File';

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.SeeFiles);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    FileDB.getChildren()
      .then((items: Array<EygleFile>) => next(items))
      .catch(next);
  }
}

/**
 * Resource class
 */
class Resource extends ARoute {

  constructor() {
    super(EPermission.SeeFiles);
  }

  /**
   * Resource GET Route
   * @param pId parent id
   * @param next
   */
  public get(pId: string, next: RestyCallback): void {
    FileDB.getChildren(pId)
      .then((items: Array<EygleFile>) => next(items))
      .catch(next);
  }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;
