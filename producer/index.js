'use strict';

/**
 * The Producer, takes care of generating an equation to send to a
 * consumer for calculation.
 * @constructor
 * @param {Object} options - the configuration for the producer
 */
function Producer (options) {
  this.setOptions(options);
}

/**
 * Sets this.options for the producer to make the configuration
 * available to the other methods
 * @param {Object} options - the configuration for the producer
 */
Producer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

  options.max      = Number(options.max)   || 1000;
  options.total    = Number(options.total) || 2;
  options.operator = Producer.ensureProperOperator(options.operator);

  this.options = options;
};

/**
 * Generates an equation with options.total number of operands, with a
 * maximum value of options.max, using the operator defined by
 * options.operator. These values are defined in the configuration.
 * @returns {String} - the equation to be sent to the consumer
 */
Producer.prototype.generateEquation = function generateEquation () {
  var operands = []
  var operator = this.options.operator;
  var total    = this.options.total;
  var equation;
  var i;

  for (i = 0; i < total; i++) {
    operands.push(Producer.generateInteger(this.options.max));
  }

  return operands.join(operator) + '=';
};

// STATIC METHODS

/**
 * Generates a random integer between 1 and max.
 * @param {Number} max - the maximum value
 * @returns {Number}
 */
Producer.generateInteger = function generateInteger (max) {
  max = max || 10;

  return Math.floor(Math.random() * (max - 1) + 1);
};

/**
 * Ensures that the operator passed in is valid, or returns a default
 * + operator if not
 * @param {String} operator - the operator
 * @returns {String} - a valid operator
 */
Producer.ensureProperOperator = function ensureProperOperator (operator) {
  operator = String(operator || '');

  if (! /^(\-|\+|\*)$/.test(operator)) {
    operator = '+';
  }

  return operator;
};

module.exports = Producer;
