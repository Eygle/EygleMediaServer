import * as q from 'q';

import ProposalSchema from '../../../schemas/Proposal.schema';
import MovieSchema from '../../../schemas/Movie.schema';
import FileSchema from '../../../schemas/File.schema';
import TMDB from '../../../modules/TMDB';
import {ARoute} from '../../../middlewares/Resty';
import {EPermission} from '../../../typings/enums';
import {RestyCallback} from '../../../typings/resty.interface';
import {Movie} from '../../../../commons/models/movie';
import {Proposal} from '../../../../commons/models/proposal';

/**
 * Resource class
 */
class Resource extends ARoute {

  constructor() {
    super(EPermission.ManageMultipleResults);
  }

  /**
   * Resource PUT Route - Choose a given proposal
   * @param id
   * @param next
   */
  public put(id: string, next: RestyCallback): void {
    ProposalSchema.get(id, {
      select: {tmdbId: 1, file: 1},
      populate: 'file'
    })
      .then((proposal: Proposal) => {
        TMDB.get(proposal.tmdbId, proposal.file)
          .then((movie: Movie) => {
            q.allSettled([
              FileSchema.save(proposal.file),
              MovieSchema.save(movie),
              this._deleteAllProposalsLinkedToFile(proposal.file._id)
            ])
              .then(next)
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }

  /**
   * Resource DELETE Route - Remove all proposals linked to a file id
   * @param fid
   * @param next
   */
  public delete(fid: string, next: RestyCallback): void {
    this._deleteAllProposalsLinkedToFile(fid)
      .then(next)
      .catch(next);

  }

  /**
   *
   * @param fid
   * @return {Q.Promise<any>}
   * @private
   */
  private _deleteAllProposalsLinkedToFile(fid) {
    const defer = q.defer();

    ProposalSchema.getAllByFileId(fid.toString())
      .then((items: Array<Proposal>) => {
        const promises = [];

        for (const item of items) {
          promises.push(ProposalSchema.remove(item));
        }

        q.allSettled(promises)
          .then(defer.resolve)
          .catch(defer.reject);
      })
      .catch(defer.reject);

    return defer.promise;
  }
}

/**
 * Collection class
 */
class Collection extends ARoute {

  constructor() {
    super(EPermission.ManageMultipleResults);
  }

  /**
   * Collection GET Route
   * @param next
   */
  public get(next: RestyCallback): void {
    ProposalSchema.getAll({
      select: {file: 1, date: 1, title: 1, originalTitle: 1, poster: 1},
      populate: 'file'
    })
      .then((items) => next(this._groupProposalsByFile(items)))
      .catch(next);
  }

  /**
   * Transform a flat list of proposals in a list of files owning an array of proposals
   * @param {Array<>} proposals
   * @private
   */
  private _groupProposalsByFile(proposals: Array<any>) {
    // list of files as object to access by id
    const files = {};

    // populate files object with files
    // Each file has a proposal array
    for (const i in proposals) {
      if (proposals.hasOwnProperty(i)) {
        const proposal = proposals[i].toObject();
        const file = proposal._file;
        const fid = proposal._file._id;

        proposals[i] = proposal;

        if (!files[fid]) {
          file.proposals = [];
          files[fid] = file;
        }

        delete proposal._file;
        files[fid].proposals.push(proposal);
      }
    }

    // files object to array
    const res = [];
    for (const f in files) {
      if (files.hasOwnProperty(f)) {
        res.push(files[f]);
      }
    }

    return res;
  }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;
