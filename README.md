## Challenge: Full-Stack

The assignment is to build a simple Producer/Consumer system. In this system the Generator will send a series of random arithmetic expressions, while the Evaluator will accept these expressions, compute the result and then report the solution to the Generator.

## Requirements

At a minimum, we would like to see the following implemented:

The Producer and Consumer as separate NodeJS services.
The Producer generating random addition expressions of two positive integers, e.g. "2+3="
The Consumer computing and returning the correct mathematical result for the each expression it receives
The Consumer successfully processing requests from two Producers concurrently at a rate of at least 1 req/sec from each Producer (2 req/sec in aggregate)
The Consumer and Producer should log all messages they generate and receive.
You are free to support more than simple addition, but it is not required.

## The end product should:

Be built in strict JavaScript and run with NodeJS
NOT rely on any external services like Redis, ZeroMQ or similar technologies
NOT use Express (Connect is Ok)
Include UML Activity Diagram and UML Sequence Diagram documenting the business logic
Include Unit tests

# Simple producer/consumer demo

In this system the Producer will send a series of random arithmetic expressions, while the Consumer will accept these expressions, compute the result and then report the solution to the Producer.

## Running this demo

### Getting things setup
Be sure you have NodeJS installed on your system. If you do not, follow these steps, and be patient because the rest of this guide will assume you know how Node works:

1. Go to nodejs.org/download
2. Download NodeJS 
3. Install NodeJS
4. If you're on a Window$ machine, reboot... (sorry)

Once NodeJS is installed, it would be great if you installed the Gulp NPM package globally. Do this by opening up terminal and running the command:
```
npm install -g gulp
```
You will know if you were successful by running the following command:
```
gulp --v
// should spit out something similar to:
// [16:56:02] CLI version 3.8.11
// [16:56:02] Local version 3.8.11
```
Now, be sure to clone this repo and `cd` into it and run `npm install`;

### Running things

First, you will need to run the Consumer/Server. Do so by running the Gulp task to start it up:
```
gulp start:consumer
```
Next, let's connect some Producers/Clients. Open a new terminal tab or window for each Producer/Client you wish to run. In each terminal tab/window, start a Producer/Client with the following command:
```
gulp start:producer
```
## Configuration

### Configuring the Consumer (Server)

By default, the Consumer will run at `localhost:3210`. You can change this by changing the `host` and `port` options located in `consumer/config.js` here:
```javascript
module.exports = {
  ...
  host:    'localhost', // host for connections
  port:    3210 // port for connections
};
```

### Configuring the Producer (Client)

If you did not change the host or port settings for the Consumer, you will not need to modify them for the Producer. If you DID change them... well, obviously...
```javascript
// producer/config.js

module.exports = {
  loop:    true, // should the client run in a loop
  timeout: 1000, // time (ms) between loops
  logfile: __dirname + '/producer.log', // log file
  host:    'localhost', // host to connect to
  port:    3210, // port to connect to,
  producer_config: { // configuration for the producer
    max:      1000, // largest random number generated
    total:    2, // total operands (numbers) that should be present in the equation
    operator: '+' // operator (valid values are currently +, -, and *
  }
};
```
## TODOS / Wish List
1. Include a module like `yargs` to make it possible to configure each Producer instance from the CLI.
2. Create a "naughty producer" that randomly throws out bad equations.
3. Terminate the connection after each request/response so we can see what that would look like. Although, I used a socket here instead of HTTP so that we could use the same connection instead of disconnecting, reconnecting every time.
4. Implement cluster.
5. Make this use some sort of I/O operation for caching or something so that I can show off using callbacks...
6. Get more professional experience using UML so I don't create noob-like UML diagrams.

## Diagrams
[View UML diagrams here](https://github.com/brianblocker/producer-consumer/tree/master/diagrams)

## Things to note about the code
1. I _personally_ prefer 2 spaces instead of tabs, but I'm more concerned with everyone on the team just using the same convention vs catering to an opinion. Not worth a debate IMHO.
2. I _personally_ make all variables, objects, and object properties `snake_case`, all "JavaScript classes" `CamelCase`, and all functions/methods/instances `camelCase`. I really like React, and React is forcing me to re-evaluate this. I am, again, more concerned with everyone on the team using the same convention.
