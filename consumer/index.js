'use strict';

var fs = require('fs');

/**
 * The Consumer, takes care of handling equations by validating and
 * solving them.
 * @constructor
 * @param {Object} options - the configuration for the consumer
 */
function Consumer (options) {
  this.setOptions(options);
}

/**
 * Sets this.options for the consumer to make the configuration
 * available to the other methods
 * @param {Object} options - the configuration for the consumer
 */
Consumer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

  this.options = options;
};

/**
 * Starting point to handle an equation solving request. This method
 * is similar in API to #getResult, except this method reads and writes
 * from the cache.
 * @param {String} equation - the equation to be solved
 * @returns {Number|String} - the result, or an invalid message
 */
Consumer.prototype.handleRequest = function handleRequest (equation) {
  var result = this.getFromCache(equation);

  if (result === undefined) {
    result = this.getResult(equation);

    this.insertIntoCache(result);
  }

  return result;
};

/**
 * Handles getting the result from an equation, which may be a message
 * that the equation was invalid. Similar in API to #handleRequest,
 * except this method runs validation and equation evaluation.
 * @param {String} equation - the equation to be solved
 * @returns {Number|String} - the result, or an invalid message
 */
Consumer.prototype.getResult = function getResult (equation) {
  if (! this.validateEquation(equation)) {
    return 'invalid equation';
  }

  return this.evaluateEquation(equation);
};

/**
 * Inserts the result of the equation into the (local, kinda) cache.
 * Let's just consider this more of a "simple optimization" than an
 * actual production-caliber solution for caching.
 * @param {String} equation - the equation that will be used as the
 *   cache key
 * @param {Number|String} result - the value to be stored in the cache
 */
Consumer.prototype.insertIntoCache = function insertIntoCache (equation, result) {
  Consumer.cache[equation] = result;
};

/**
 * Gets the result from the cache for equation
 * @param {String} equation - the cache key
 * @returns {Number|String} result - the value from the cache
 */
Consumer.prototype.getFromCache = function getFromCache (equation) {
  return Consumer.cache[equation];
};

/**
 * Evaluations the equation using a slightly nice eval, if there ever
 * was such a thing. Eval is evil and incredibly dangerous. If we were
 * not running #validateEquation before we ran this method, we could be
 * seriously living on the edge here. #yolo
 * @param {String} equation - the equation to be solved
 * @returns {Number} - the solved value of the equation
 */
Consumer.prototype.evaluateEquation = function evaluateEquation (equation) {
  equation = equation.replace(/=$/, '');

  /**
   * We are in strict mode, so we need to append the var created in the
   * eval statement so that we can get the result back. This may or may
   * not be an acceptable replacement for regexing the equation.
   */
  return eval('var result = ' + equation + '; result');
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
