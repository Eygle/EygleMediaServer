import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';

export const tvShowSchema: mongoose.Schema = DB.createSchema({
  title: String,

  tvdbId: Number,
  imdbId: String,

  banner: String,
  poster: String,
  posterThumb: String,
  genres: [{type: String}],
  overview: String,

  actors: [{
    tvdbId: Number,
    name: String,
    character: String,
    image: String
  }],

  seasons: Number,
  episodes: Number,
  start: Date,
  end: Date,
  runtime: Number,
  status: String,
  network: String,
});
