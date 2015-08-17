'use strict';

var Q = require('q');

/**
 * The Consumer, takes care of handling equations by validating and
 * solving them.
 * @constructor
 */
function Consumer (options) {

}

/**
 * Starting point to handle an equation solving request. This method
 * is similar in API to #getResult, except this method reads and writes
 * from the cache.
 * @param {String} equation - the equation to be solved
 * @param {Function} callback - the callback that passes the result
 */
Consumer.prototype.handleRequest = function handleRequest (equation, callback) {
  var getFromCache    = Q.nbind(this.getFromCache,    this);
  var getResult       = Q.nbind(this.getResult,       this);
  var insertIntoCache = Q.nbind(this.insertIntoCache, this, equation);

  getFromCache(equation)
    .then(function (result) {
      callback(null, result);
    })
    .fail(function () {
      getResult(equation)
        .then(insertIntoCache, callback)
        .then(function (result) {
          console.log('it was a success')
          callback(null, result)
        });
    });
};

/**
 * Handles getting the result from an equation, which may be a message
 * that the equation was invalid. Similar in API to #handleRequest,
 * except this method runs validation and equation evaluation.
 * @param {String} equation - the equation to be solved
 * @param {Function} callback - the callback with the result
 */
Consumer.prototype.getResult = function getResult (equation, callback) {
  var evaluateEquation;

  if (! this.validateEquation(equation)) {
    callback('invalid equation');
  }

  evaluateEquation = Q.nbind(this.evaluateEquation, this);

  evaluateEquation(equation)
    .then(function (result) {
      callback(null, result);
    }, callback);
};

/**
 * Inserts the result of the equation into the (local, kinda) cache.
 * Let's just consider this more of a "simple optimization" than an
 * actual production-caliber solution for caching.
 * @param {String} equation - the equation that will be used as the
 *   cache key
 * @param {Number|String} result - the value to be stored in the cache
 * @param {Function} callback - the callback with the result
 */
Consumer.prototype.insertIntoCache = function insertIntoCache (equation, result, callback) {
  Consumer.cache[equation] = result;

  callback(null, result);
};

/**
 * Gets the result from the cache for equation
 * @param {String} equation - the cache key
 * @param {Function} callback - the callback with the result
 */
Consumer.prototype.getFromCache = function getFromCache (equation, callback) {
  var result = Consumer.cache[equation];

  if (result === undefined) {
    callback('not found');
  }
  else {
    callback(null, result);
  }
};

/**
 * Evaluations the equation using a slightly nice eval, if there ever
 * was such a thing. Eval is evil and incredibly dangerous. If we were
 * not running #validateEquation before we ran this method, we could be
 * seriously living on the edge here. #yolo
 * @param {String} equation - the equation to be solved
 * @returns {Number} - the solved value of the equation
 */
Consumer.prototype.evaluateEquation = function evaluateEquation (equation, callback) {
  equation = equation.replace(/=$/, '');

  /**
   * We are in strict mode, so we need to append the var created in the
   * eval statement so that we can get the result back. This may or may
   * not be an acceptable replacement for regexing the equation.
   */
  callback(null, eval('var result = ' + equation + '; result'));
};

/**
 * Validates the equation, ensuring that it starts with a number, only
 * has operands and operators, and ends with an =. This is the only way
 * I would ever consider using eval in #evaluateEquation.
 * @param {String} equation - the equation to be validated
 * @param {Boolean} - if the equation is valid or not
 */
Consumer.prototype.validateEquation = function validateEquation (equation) {
  return /^\d+((\+|\-|\*)\d+)+=$/.test(String(equation));
};

/**
 * The cache. Ha. Well, at least we get some minor optimizations here
 * until we run out of memory.
 */
Consumer.cache = Object.create(null);

module.exports = Consumer;
