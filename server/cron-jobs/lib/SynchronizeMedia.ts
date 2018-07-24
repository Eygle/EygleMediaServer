import * as fs from 'fs';
import * as q from 'q';
import * as path from 'path';
import * as _ from 'underscore';
import * as ptn from 'parse-torrent-name';

import AJob from 'eygle-core/server/models/AJob';
import FileDB from '../../db/FileDB';
import {EygleFile} from '../../../commons/models/File';
import {LocalFile} from '../../../commons/models/LocalFile';
import FileUtils from '../../../commons/FileUtils';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';
import {EEnv} from 'eygle-core/commons/core.enums';
import ADBModel from 'eygle-core/server/db/ADBModel';


export abstract class SynchronizeMedia extends AJob {

  /**
   * List of local files identified as movies
   */
  protected media: Array<LocalFile>;

  /**
   * Number of movies added
   */
  protected nbrMediaAdded: number;

  /**
   * List of local files to process and add in database
   */
  private _filesToAdd: Array<LocalFile>;

  /**
   * List of files not present anymore to remove from database
   */
  private _filesToDelete: Array<LocalFile>;

  /**
   * Number of files added
   */
  private _nbrFilesAdded: number;

  /**
   * Number of files deleted
   */
  private _nbrFilesDeleted: number;

  /**
   * Dump JSON file path
   */
  private readonly _dumpPath: string;

  /**
   * Media model
   */
  private readonly _mediaModel: any;

  /**
   * Path where all media are stored
   */
  private readonly _mediaPath: string;

  constructor(name: string, mediaPath: string, dump: string, model: ADBModel) {
    super(name);
    this.scheduleRule = '* * * * *';
    this.environments = [EEnv.Prod];
    this._mediaPath = mediaPath;
    this._mediaModel = model;
    this._dumpPath = EEnv.Dev === ServerConfig.env ? `${ServerConfig.root}/../${dump}` : `${ServerConfig.filesRoot}/${dump}`;

    if (!fs.existsSync(ServerConfig.filesRoot)) {
      fs.mkdirSync(ServerConfig.filesRoot);
    }

    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath);
    }
  }

  /**
   * Run service
   */
  public run(): void {
    super.run();

    this._filesToAdd = [];
    this.media = [];
    this.nbrMediaAdded = 0;
    this._nbrFilesAdded = 0;
    this._nbrFilesDeleted = 0;

    this._synchronize()
      .finally(() => this.end());
  }

  /**
   * Clean job
   */
  public clean() {
    this._filesToAdd = [];
    this.media = [];
    this.nbrMediaAdded = 0;
    this._nbrFilesAdded = 0;
    this._nbrFilesDeleted = 0;
  }

  /**
   * Add check if needed for given LocalFile
   * @param {} f
   * @return {boolean}
   */
  protected abstract isValidMedia(f: LocalFile): boolean;

  /**
   * Add all new files to database and extract media if possible
   * Remove all files to delete
   * @return {Q.Promise<any>}
   * @private
   */
  protected abstract processFilesToAddSynchronously(defer?: q.Deferred<void>): q.Promise<void>;

  /**
   * Get full list of local files
   * Compare to previous list
   * Save new media
   * Remove deleted media
   */
  private _synchronize() {
    const defer = q.defer();
    const previous = this._load();
    const files: Array<LocalFile> = this._listDirectory(this._mediaPath);

    this._dump(files); // dump as soon as possible to avoid having two time the same task running on the same media
    for (const f of files) {
      const idx = _.findIndex(previous, (o: LocalFile) => {
        return o.filename === f.filename && o.size === f.size && o.path === f.path;
      });

      if (!~idx) {
        this._filesToAdd.push(f);
      } else {
        previous.splice(idx, 1);
      }
    }
    // Add remaining files (not present anymore) to files to delete list
    this._filesToDelete = previous;

    this._identifyMediaList();
    this.processFilesToAddSynchronously()
      .then(() => this._processFilesToDelete()
        .then(() => this._saveNewFiles()
          .then(() => {
            this.logger.info(`${this.nbrMediaAdded} medias added`);
            this.logger.info(`${this._nbrFilesAdded} files added`);
            this.logger.info(`${this._nbrFilesDeleted} files deleted`);
            defer.resolve();
          }).catch(defer.reject)
        ).catch(defer.reject)
      ).catch(defer.reject);

    return defer.promise;
  }

  /**
   * Identify media list
   * @param {Array<>} list
   * @param {} parent
   */
  private _identifyMediaList(list = this._filesToAdd, parent: EygleFile = null) {
    for (const f of list) {
      f.parent = parent ? parent._id.toString() : null;
      f.model = FileDB.create(f);
      if (f.directory && f.children) {
        this._identifyMediaList(f.children, f.model);
      } else {
        if (FileUtils.isVideo(f.ext)) {
          if (!f.mediaInfo) {
            f.mediaInfo = ptn(f.filename);
          }
          if (!f.mediaInfo.title) continue;

          if (this.isValidMedia(f)) {
            this.media.push(f);
          }
        }
      }
    }
  }

  /**
   * Delete all filesToDelete from database and the linked media
   * @return {Q.Promise<any>}
   * @private
   */
  private _processFilesToDelete() {
    const promises = [];

    for (const f of this._filesToDelete) {
      const defer = q.defer();

      q.allSettled([
        <any>FileDB.remove(f.model),
        this._mediaModel.setDeletedById(f.model._id)
      ]).then(() => defer.resolve())
        .catch((err) => defer.reject(err));
      this._nbrFilesDeleted++;

      promises.push(defer.promise);
    }

    return q.allSettled(promises);
  }

  /**
   * Save all new [[IFile]]s
   * @return {Q.Promise<Array<Q.PromiseState<any>>>}
   * @private
   */
  private _saveNewFiles(files = this._filesToAdd) {
    const promises = [];

    for (const f of files) {
      if (f.model) {
        promises.push(FileDB.save(f.model));
        this._nbrFilesAdded++;
      }
      if (f.children) {
        promises.push(this._saveNewFiles(f.children));
      }
    }

    return q.allSettled(promises);
  }

  /**
   * List directory files
   * @param dir
   * @param {any} filePath
   * @return {LocalFile[]} full hierarchy
   * @private
   */
  private _listDirectory(dir, filePath = null) {
    return _.map(fs.readdirSync(dir), (f) => {
      const filename = path.join(dir, f);
      const stats = fs.statSync(filename);
      const file: LocalFile = <LocalFile>{
        filename: f,
        directory: stats.isDirectory(),
        mtime: stats.mtime,
        path: filePath
      };
      if (stats.isDirectory()) {
        file.children = this._listDirectory(filename, filePath ? filePath + '/' + f : f);
        file.size = this._filesSize(file.children);
      } else {
        file.ext = path.extname(f);
        file.size = stats.size;
      }

      return file;
    });
  }

  /**
   * Return size of a given directory
   * @param files
   * @return {number}
   * @private
   */
  private _filesSize(files) {
    return _.reduce(files, (memo: number, f: LocalFile) => {
      return memo + f.size;
    }, 0);
  }

  /**
   * Dump full files list into a local JSON file
   */
  private _dump(data: Array<LocalFile>) {
    fs.writeFileSync(this._dumpPath, JSON.stringify(data));
  }

  /**
   * Load previous full files list from local JSON file
   */
  private _load() {
    if (!fs.existsSync(this._dumpPath)) {
      return [];
    }

    const json = <any>fs.readFileSync(this._dumpPath);
    return json ? JSON.parse(json) : [];
  }
}
