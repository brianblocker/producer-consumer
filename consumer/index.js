'use strict';

var fs = require('fs');

function Consumer (options) {
  this.setOptions(options);
}

Consumer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

  options.logger = options.logger || console.log;

  this.options = options;
};

Consumer.prototype.handleRequest = function handleRequest (expression) {
  var result = this.getFromCache(expression);

  this.addToLog('Received ' + expression + ' from client');

  if (result === undefined) {
    result = this.getResult(expression);

    this.insertIntoCache(result);
  }

  this.addToLog(['Returning result of', expression, 'as', result, 'to client'].join(' '));

  return result;
};

Consumer.prototype.getResult = function getResult (expression) {
  if (! this.validateExpression(expression)) {
    return '"invalid expression"';
  }

  return this.evaluateExpression(expression);
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

Consumer.prototype.addToLog = function addToLog (message) {
  var timestamp = (new Date()).toISOString();

  message = timestamp + ': ' + message;

  this.options.logger(message);
};

Consumer.prototype.turnOffTimer = function turnOffTimer () {
  if (this.logWriterTimeout) {
    clearTimeout(this.logWriterTimeout);
  }

  this.logWriterTimeout = false;
};

Consumer.prototype.writeLogsToFile = function writeLogsToFile () {
  var new_message = '';
  var timeout     = 10000;
  var writeLogs   = this.writeLogsToFile.bind(this);
  var tmp;

  if (! this.options.writeLogs) {
    return;
  }

  if (Consumer.logs.length < 1) {
    this.logWriterTimeout = setTimeout(writeLogs, timeout)
  }

  new_message = Consumer.logs.join('\n');

  Consumer.logs = [];

  fs.appendFile(__dirname + '/log.txt', new_message, function (err) {
    if (err) {
      console.log(err);
    }

    this.logWriterTimeout = setTimeout(writeLogs, timeout);
  }.bind(this));
};

Consumer.cache = Object.create(null);
Consumer.logs  = [];

module.exports = Consumer;
