var winston  = require('winston');
var options  = require('./config');
var Producer = require('./index');
var net      = require('net');
var producer;
var client;

winston.add(winston.transports.DailyRotateFile, {filename: options.logfile});

client   = new net.Socket();
producer = new Producer();

function loop () {
  var equation = producer.generateEquation();

  winston.info('Sending ' + equation + ' to server');

  client.write(equation);
}

client.connect(options.port, options.host, function () {
  console.log('Connected to server at', [options.host, options.port].join(':'));

  loop();
});

client.on('data', function (data) {
  winston.info('Received ' + String(data) + ' from server');

  if (options.loop) {
    setTimeout(loop, options.timeout);
  }
});
