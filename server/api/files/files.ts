import FileSchema from "../../schemas/File.schema"
import {ARoute} from "../../middlewares/Resty";
import {EPermission} from "../../typings/enums";
import {RestyCallback} from "../../typings/resty.interface";
import {EygleFile} from "../../../commons/models/file";

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
