module.exports = {
  loop:    true, // should the client run in a loop
  timeout: 1000, // time (ms) between loops
  logfile: __dirname + '/producer.log', // log file
  host:    'localhost', // host to connect to
  port:    3210, // port to connect to,
  producer_config: { // configuration for the producer
    max:      1000,
    total:    2,
    operator: '+'
  }
};
