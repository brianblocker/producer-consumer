'use strict';

var fs      = require('fs');
var winston = require('winston');

winston.add(winston.transports.DailyRotateFile, {filename: __dirname + '/consumer.log'});

function Consumer (options) {
  this.setOptions(options);
}

Consumer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

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
  winston.info(message);
};

Consumer.cache = Object.create(null);

module.exports = Consumer;
