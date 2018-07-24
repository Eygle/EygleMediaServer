import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';
import Utils from 'eygle-core/commons/utils/Utils';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

export const fileSchema: mongoose.Schema = DB.createSchema({
  filename: String,
  ext: String,
  size: Number,
  path: String,
  normalized: String,
  mtime: Date,
  directory: Boolean,

  mediaInfo: {
    title: String,
    season: Number,
    episode: Number,
    episodeName: String,
    region: String,
    year: Number,
    language: String,
    resolution: String,
    repack: Boolean,
    quality: String,
    proper: Boolean,
    hardcoded: Boolean,
    extended: Boolean,
    codec: String,
    audio: String,
    group: String,
    excess: {
      type: [String],
      'default': null
    }
  },

  parent: {type: String, ref: ServerConfig.dbCollectionsPrefix + 'File'},
  episode: {type: String, ref: ServerConfig.dbCollectionsPrefix + 'TVShow'},
  movie: {type: String, ref: ServerConfig.dbCollectionsPrefix + 'Movie'},
}, true, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

fileSchema.pre('save', function (next) {
  if (this.isNew) {
    this.normalized = Utils.normalize(this.filename);
  }
  next();
});
