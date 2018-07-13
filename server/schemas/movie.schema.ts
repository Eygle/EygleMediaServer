import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';
import ServerConfig from 'eygle-core/server/utils/ServerConfig';

export const movieSchema: mongoose.Schema = DB.createSchema({
  title: String,
  originalTitle: String,
  date: Date,
  countries: [{type: String}],
  genres: [{type: String}],
  overview: String,
  budget: Number,
  revenue: Number,
  originalLanguage: String,
  runtime: Number,

  poster: String,
  posterThumb: String,
  backdrop: String,

  cast: [{
    tmdbId: Number,
    name: String,
    character: String,
    image: String
  }],
  crew: [{
    tvdbId: Number,
    name: String,
    job: String,
    image: String,
  }],

  videos: [{
    id: String,
    lang: String,
    key: String,
    name: String,
    site: String,
    size: Number,
    videoType: String
  }],

  tmdbId: Number,

  files: [{type: String, ref: ServerConfig.dbCollectionsPrefix + 'File'}]
});
