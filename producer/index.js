function Producer (options) {
  this.setOptions(options);

  this.timer = false;
}

Producer.prototype.stop = function stop () {
  if (this.timer) {
    clearTimeout(this.timer);
  }

  this.timer = false;
};

Producer.prototype.setOptions = function setOptions (options) {
  options = options || Object.create(null);

  options.max      = Number(options.max)     || 1000;
  options.loop     = options.loop            || false;
  options.timeout  = Number(options.timeout) || 1000;
  options.total    = Number(options.total)   || 2;
  options.operator = options.operator        || '+';
  options.operator = Producer.ensureProperOperator(options.operator);

  this.options = options;
};

Producer.prototype.generateInteger = function generateInteger () {
  return Math.floor(Math.random() * this.options.max);
};

Producer.prototype.run = function run () {
  var equation = this.generateEquation();

  // TODO: pass equation to service & log

  if (this.options.loop) {
    this.timer = setTimeout(this.run.bind(this), this.options.timeout);
  }
};

Producer.prototype.generateEquation = function generateEquation () {
  var operands = []
  var operator = this.options.operator;
  var total    = this.options.total;
  var equation;
  var i;

  for (i = 0; i < total; i++) {
    operands.push(this.generateInteger());
  }

  return operands.join(operator) + '=';
};

// STATIC METHODS

Producer.ensureProperOperator = function ensureProperOperator (operator, default_operator) {
  default_operator = default_operator || '+';

  operator = String(operator || '');

  if (! /^(\-|\+|\*)$/.test(operator)) {
    operator = default_operator;
  }

  return operator;
};

module.exports = Producer;
