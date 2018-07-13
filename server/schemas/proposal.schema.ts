import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

const proposalSchema: mongoose.Schema = DB.createSchema({
  title: String,
  originalTitle: String,
  date: Date,
  overview: String,
  poster: String,

  tmdbId: Number,

  file: {type: String, ref: ServerConfig.dbCollectionsPrefix + 'File'}
}, false);
