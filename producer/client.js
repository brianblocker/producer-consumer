var net      = require('net');
var options  = require('./config'); // default configuration
var Producer = require('./index');
var winston  = require('winston'); // logger
var client;
var producer;

/**
 * Setup for the log file. Tells the logger which file to write logs
 * to, and to create a new file each day.
 */
winston.add(winston.transports.DailyRotateFile, {filename: options.logfile});

/**
 * Instantiate a client (socket) and a producer
 */
client   = new net.Socket();
producer = new Producer(options.producer_config);

/**
 * Set encoding for all transmissions on this socket so we don't have
 * to deal with buffers
 */
client.setEncoding('utf8');

/**
 * Generates the equation and sends it to the consumer
 */
function loop () {
  var equation = producer.generateEquation();

  winston.info('Sending ' + equation + ' to server');

  client.write(equation);
}

/**
 * Connects to the server
 */
client.connect(options.port, options.host, function () {
  console.log('Connected to server at', [options.host, options.port].join(':'));

  loop();
});

/**
 * Log error events
 */
client.on('error', function (err) {
  console.log('Error:', err);
});

/**
 * Handle data received from the server
 */
client.on('data', function (data) {
  winston.info('Received ' + data + ' from server');

  if (options.loop) {
    setTimeout(loop, options.timeout);
  }
});
