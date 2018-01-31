import TMDB, {ITMDBMovie} from '../../modules/TMDB';
import {ARoute} from '../../core/middlewares/Resty';
import {EPermission} from '../../core/typings/server.enums';
import {RestyCallback} from '../../core/typings/resty.interface';

/**
 * Resource class
 */
class Resource extends ARoute {

  constructor() {
    super(EPermission.EditMovies);
  }

  /**
   * Resource PUT Route - Choose a given proposal
   * @param term
   * @param next
   */
  public get(term: string, next: RestyCallback): void {
    TMDB.searchByTitle(decodeURI(term))
      .then((items: Array<ITMDBMovie>) => TMDB.createAutocompleteFromTMDBResults(items))
      .catch(next);
  }
}

module.exports.Resource = Resource;
