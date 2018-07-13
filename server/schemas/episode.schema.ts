import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

export const episodeSchema: mongoose.Schema = DB.createSchema({
  title: String,

  tvdbId: Number,
  tvdbSeasonId: Number,

  number: Number,
  season: Number,

  date: Date,

  overview: String,

  tvShow: {type: String, ref: ServerConfig.dbCollectionsPrefix + 'TVShowDB'},
  files: [{type: String, ref: ServerConfig.dbCollectionsPrefix + 'File'}]
});
