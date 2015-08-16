var glob    = require('glob');
var gulp    = require('gulp');
var path    = require('path');
var nodemon = require('gulp-nodemon');
var cwd     = path.normalize(__dirname + '/../../');

function consumer () {
  return nodemon({
    script: cwd + 'consumer/server.js'
  });
}

function producer () {
  return nodemon({
    script: cwd + 'producer/client.js'
  });
}

gulp.task('start:consumer', consumer);
gulp.task('start:producer', producer);
