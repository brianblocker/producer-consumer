var glob  = require('glob');
var gulp  = require('gulp');
var path  = require('path');
var mocha = require('gulp-mocha');
var cwd   = path.normalize(__dirname + '/../../');

function tests () {
  var test_files = glob.sync('+(consumer|producer)/**/*.test', {cwd: cwd});

  return gulp.src(test_files, {read: false})
    .pipe(mocha({reporter: 'spec'}));
}

gulp.task('tests', tests);
