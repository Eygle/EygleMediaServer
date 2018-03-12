import * as fs from 'fs';
import * as uniqid from 'uniqid';
import * as zipstream from 'zip-stream';
import * as _ from 'underscore';
import * as async from 'async';
import * as path from 'path';

import FileDB from '../db/FileDB';
import {EygleFile} from '../../commons/models/File';
import EMSUtils from '../utils/EMSUtils';
import {CustomEdError} from 'eygle-core/server/utils/EdError';
import Utils from 'eygle-core/commons/utils/Utils';
import {EHTTPStatus} from 'eygle-core/server/typings/server.enums';
import Cache from 'eygle-core/server/modules/Cache';

class FileDownload {

  /**
   * Single file downloader middleware
   * @returns {(res, req, next) => any}
   */
  getSingleFileMiddleware() {
    return (req, res, next) => {
      FileDB.get(req.params.id)
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
      FileDB.getAllByIds(req.body.files)
        .then((files: [EygleFile]) => {
          const paths = [];
          for (const file of files) {
            paths.push({
              path: EMSUtils.getFileRealPath(file),
              name: file.filename,
              size: file.size,
              directory: file.directory
            });
          }

          // Create a uniq id to store the list of files to download and store it in the cache for an hour
          const id = uniqid();
          Cache.set(`dl-${id}`, paths, 600);

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
      const files = this._loadAllFiles(Cache.get(`dl-${req.params.id}`));
      Cache.remove(`dl-${req.params.id}`);

      if (files) {
        const zip = zipstream({level: 1});
        const size = Utils.formatSize(_.reduce(files, function (total, f) {
          return total + f.size;
        }, 0));

        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', `attachment; filename="${files.length} files - ${size}"`);
        zip.pipe(res); // res is a writable stream

        const addFile = function (file, cb) {
          zip.entry(fs.createReadStream(file.path), {name: file.name}, cb);
        };

        async.forEachSeries(files, addFile, function (err) {
          if (err) return next(err);
          zip.finalize();
        });
      } else {
        next(new CustomEdError('Invalid link', EHTTPStatus.NotFound));
      }
    };
  }

  /**
   * Load all files from paths including directory files
   * @param files
   * @private
   */
  private _loadAllFiles(files) {
    let res = [];

    for (const f of files) {
      if (f.directory) {
        const childs = [];

        for (const childName of fs.readdirSync(f.path)) {
          const childPath = path.join(f.path, childName);
          const stats: any = fs.statSync(childPath);

          childs.push({
            path: childPath,
            name: childName,
            size: stats.size,
            directory: stats.isDirectory()
          });
        }

        res = res.concat(this._loadAllFiles(childs));
      } else {
        res.push(f);
      }
    }

    return res;
  }
}

export default new FileDownload();
