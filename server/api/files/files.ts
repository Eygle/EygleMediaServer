import FileSchema from '../../schemas/File.schema';
import {ARoute} from '../../core/middlewares/Resty';
import {EPermission} from '../../../commons/core/core.enums';
import {RestyCallback} from '../../core/typings/resty.interface';
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
    FileSchema.getChildren()
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
    FileSchema.getChildren(pId)
      .then((items: Array<EygleFile>) => next(items))
      .catch(next);
  }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;
