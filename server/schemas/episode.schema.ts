import * as mongoose from 'mongoose';

import DB from 'eygle-core/server/modules/DB';

export const episodeSchema: mongoose.Schema = DB.createSchema({
  title: String,

  tvdbId: Number,
  tvdbSeasonId: Number,

  number: Number,
  season: Number,

  date: Date,

  overview: String,

  tvShow: {type: String, ref: 'TVShowDB'},
  files: [{type: String, ref: 'File'}]
});
