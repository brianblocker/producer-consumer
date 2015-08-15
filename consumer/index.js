'use strict';

var fs = require('fs');

function Consumer (options) {
  this.setOptions(options);
}

Consumer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

  this.options = options;
};

Consumer.prototype.insertIntoCache = function insertIntoCache (expression, result) {
  Consumer.cache[expression] = result;
};

Consumer.prototype.getFromCache = function getFromCache (expression) {
  return Consumer.cache[expression];
};

Consumer.prototype.evaluateExpression = function evaluateExpression (expression) {
  expression = expression.replace(/=$/, '');

  /**
   * We are in strict mode, so we need to append the var created in the
   * eval statement so that we can get the result back
   */
  return eval('var result = ' + expression + '; result');
};

Consumer.prototype.validateExpression = function validateExpression (expression) {
  return /^\d+((\+|\-|\*)\d+)+=$/.test(String(expression));
};

Consumer.prototype.logResults = function logResults (message) {
  var timestamp = (new Date()).toISOString();

  Consumer.logs.push([timestamp, message].join(': '));
};

Consumer.prototype.writeLogsToFile = function writeLogsToFile () {
  var new_message = '';
  var tmp;

  new_message = Consumer.logs.join('\n');

  Consumer.logs = [];

  if (! this.options.writeLogs) {
    console.log(new_message);

    return;
  }

  fs.appendFile(__dirname + '/log.txt', new_message, function (err) {
    if (err) {
      console.log(err);
    }

    setTimeout(this.writeLogsToFile, 10000);
  }.bind(this));
};

Consumer.cache = {};
Consumer.logs  = [];

module.exports = Consumer;
