var Consumer = require('./index');
var consumer = new Consumer();
var net      = require('net');
var options  = require('./config'); // default configuration
var winston  = require('winston'); // logger
var server;

/**
 * Setup for the log file. Tells the logger which file to write logs
 * to, and to create a new file each day.
 */
winston.add(winston.transports.DailyRotateFile, {filename: options.logfile});

/**
 * Setup the server
 */
server = net.createServer();

server.listen(options.port, options.host);

console.log('server listening at', [options.host, options.port].join(':'));

/**
 * Handle when a client (socket) is connected to the server
 */
server.on('connection', function (client) {
  console.log('Client connected: ' + client.remoteAddress + ':' + client.remotePort);

  /**
   * Set encoding for all transmissions to this client so we don't have
   * to deal with buffers
   */
  client.setEncoding('utf8');

  /**
   * Log client errors
   */
  client.on('error', function (err) {
    console.log('Socket Error:', err);
  });

  /**
   * Handle when data is received from the client, handle the request
   * with the consumer, and respond back to the client
   */
  client.on('data', function (data) {
    var expression = data;
    var result;

    winston.info('Received ' + expression + ' from client');

    consumer.handleRequest(expression, function (err, result) {
      winston.info(['Returning result of', expression, 'as', result, 'to client'].join(' '));

      client.write(expression + result);
    });
  });

  /**
   * Log when a client disconnects
   */
  client.on('close', function(data) {
    console.log('client disconnected');
  });
});

/**
 * Log server errors
 */
server.on('error', function (err) {
  console.log('Server Error:', err);
});


