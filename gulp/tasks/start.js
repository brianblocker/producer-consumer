var glob    = require('glob');
var gulp    = require('gulp');
var path    = require('path');
var nodemon = require('gulp-nodemon');
var cwd     = path.normalize(__dirname + '/../../');

/**
 * Runs a consumer server
 */
function consumer () {
  return nodemon({
    script: cwd + 'consumer/server.js',
    ext:    'js'
  });
}

/**
 * Runs a producer client
 */
function producer () {
  return nodemon({
    script: cwd + 'producer/client.js',
    ext:    'js'
  });
}

gulp.task('start:consumer', consumer);
gulp.task('start:producer', producer);
