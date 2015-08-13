var requireDir = require('require-dir');
var config     = require('./config/gulp_config');

requireDir('./gulp/tasks', {recurse: true});
