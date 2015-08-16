var Consumer = require('./index');
var consumer = new Consumer();
var options  = require('./config');
var net      = require('net');
var winston  = require('winston');
var server;

winston.add(winston.transports.DailyRotateFile, {filename: options.logfile});

server = net.createServer();

server.listen(options.port, options.host);

console.log('server listening at', [options.host, options.port].join(':'));

server.on('connection', function (socket) {
  console.log('Client connected: ' + socket.remoteAddress + ':' + socket.remotePort);

  socket.on('data', function (data) {
    var expression = String(data);
    var result;

    winston.info('Received ' + expression + ' from client');

    result = consumer.handleRequest(expression);

    winston.info(['Returning result of', expression, 'as', result, 'to client'].join(' '));

    socket.write(String(result));
  });

  socket.on('close', function(data) {
    console.log('client disconnected');
  });
});


