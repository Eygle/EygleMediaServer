'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const q = require('q');
const ts = require('gulp-typescript');
const gnodemon = require('gulp-nodemon');
const del = require('del');

const paths = {
  "root": ".",
  "server": "server",
  "commons": "commons",
  "outRoot": "dist",
  "outDir": "dist/server"
};

let nodemon = null;

/**
 *  Default task launch the main optimization build task
 */
gulp.task('server:build', [], function () {
  const dConf = q.defer();
  const dMisc = q.defer();
  const dTpl = q.defer();
  const dFiles = q.defer();

  clean();

  gulp.src(`${paths.root}/eygle-conf.json`)
    .pipe(gulp.dest(`${paths.outRoot}`))
    .on('end', () => dConf.resolve());

  gulp.src(`${paths.server}/templates/**/*`)
    .pipe(gulp.dest(`${paths.outDir}/templates`))
    .on('end', () => dTpl.resolve());

  gulp.src(`${paths.server}/misc/**/*`)
    .pipe(gulp.dest(`${paths.outDir}/misc`))
    .on('end', () => dMisc.resolve());


  gulp.src(`${paths.server}/files/**/*`)
    .pipe(gulp.dest(`${paths.outDir}/files`))
    .on('end', () => dFiles.resolve());

  return q.allSettled([
    transpiling(),
    dConf.promise,
    dTpl.promise,
    dFiles.promise,
    dMisc.promise
  ]);
});

/**
 *  Run task launch the server
 */
gulp.task('server:run', ['server:build'], function () {
  gulp.watch(`${paths.server}/**/*.ts`, transpiling);

  nodemon = gnodemon({
    script: `${paths.outDir}/server.js`,
    watch: [`${paths.outDir}/server.js`],
    ext: 'html js',
    env: {'NODE_ENV': 'development'},
    delay: 1
  });
});

// region privates

function clean() {
  task.start('clean');
  del.sync(`./${paths.outDir}`);
  task.finished('clean');
}

function transpiling() {
  const defer = q.defer();

  task.start('transpiling');
  gulp.src([`${paths.server}/**/*.ts`, `${paths.commons}/**/*.ts`], {follow: true})
    .pipe(ts({removeComments: false, target: 'es6', module: "commonjs"})).on('error', (err) => console.error(err))
    .pipe(gulp.dest(paths.outDir))
    .on('end', () => defer.resolve());
  task.finished('transpiling');

  return defer.promise;
}

// endregion

const times = {};
const task = {

  start: (name) => {
    gutil.log(`Starting ${gutil.colors.grey('private')} '${gutil.colors.cyan(name)}'...`);
    times[name] = Date.now()
  },

  finished: (name) => {
    gutil.log(`Finished ${gutil.colors.grey('private')} '${gutil.colors.cyan(name)}' after ${gutil.colors.magenta(formatTaskDuration(name))}`);
    delete times[name];
  }
};

function formatTaskDuration(task) {
  const time = times[task];
  if (!time) {
    return `no task ${task} started`;
  }
  const diff = Date.now() - time;

  if (diff > 1000) {
    const sec = diff / 1000;
    return `${sec >= 10 ? Math.round(sec) : sec} s`;
  }
  return `${diff} ms`;
}
