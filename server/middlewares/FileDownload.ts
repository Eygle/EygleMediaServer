import FileSchema from "../schemas/File.schema";
import {EygleFile} from "../../commons/models/File";
import * as fs from "fs";
import EMSUtils from "../utils/EMSUtils";
import {CustomEdError} from '../core/config/EdError';
import Utils from '../../commons/core/utils/Utils';
import {EHTTPStatus} from '../core/typings/server.enums';
import Cache from '../core/modules/Cache';
import * as uniqid from 'uniqid'
import * as zipstream from 'zip-stream';
import * as _ from 'underscore';
import * as async from 'async';

class FileDownload {

  /**
   * Single file downloader middleware
   * @returns {(res, req, next) => any}
   */
  getSingleFileMiddleware() {
    return (req, res, next) => {
      FileSchema.get(req.params.id)
        .then((file: EygleFile) => {
          const localFile = EMSUtils.getFileRealPath(file);
          if (fs.existsSync(localFile)) {
            res.download(localFile);
          } else {
            next(new CustomEdError(`No such file: ${localFile}`, EHTTPStatus.NotFound));
          }
        }).catch(err => next(err));
    };
  }

  /**
   * Multiple file downloader middleware
   * @returns {(res, req, next) => any}
   */
  getMultipleFileLinkGeneratorMiddleware() {
    return (req, res, next) => {
      FileSchema.getAllByIds(req.body.files)
        .then((files: [EygleFile]) => {
          const paths = [];
          for (const file of files) {
            paths.push({path: EMSUtils.getFileRealPath(file), name: file.filename, size: file.size});
          }

          // Create a uniq id to store the list of files to download and store it in the cache for an hour
          const id = uniqid();
          Cache.set(`dl-${id}`, paths, 3600);

          res.send({url: `/dl/zip/${id}`});
        }).catch(err => next(err));
    };
  }

  /**
   * Multiple file downloader middleware
   * @returns {(res, req, next) => any}
   */
  getMultipleFileMiddleware() {
    return (req, res, next) => {
      const files = Cache.get(`dl-${req.params.id}`);
      Cache.remove(`dl-${req.params.id}`);

      if (files) {
        const zip = zipstream({level: 1});
        const size = Utils.formatSize(_.reduce(files, function (total, f) {
          return total + f.size
        }, 0));

        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', `attachment; filename="'${files.length} files - ${size}'"`);
        zip.pipe(res); // res is a writable stream

        const addFile = function (file, cb) {
          zip.entry(fs.createReadStream(file.path), {name: file.name}, cb);
        };

        async.forEachSeries(files, addFile, function (err) {
          if (err) return next(err);
          zip.finalize();
          // next(null, zip.getBytesWritten());
        });
      } else {
        next(new CustomEdError("Invalid link", EHTTPStatus.NotFound))
      }
    };
  }

  private _
}

export default new FileDownload();
