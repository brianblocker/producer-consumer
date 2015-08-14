function Consumer () {

}

Consumer.prototype.insertIntoCache = function insertIntoCache (expression, result) {
  Consumer.cache[expression] = result;
};

Consumer.prototype.getFromCache = function getFromCache (expression) {
  return Consumer.cache[expression];
};

Consumer.prototype.validateExpression = function validateExpression (expression) {
  return /^\d+((\+|\-|\*)\d+)+=$/.test(String(expression));
};

Consumer.cache = {};

module.exports = Consumer;
