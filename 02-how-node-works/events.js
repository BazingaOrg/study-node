const EventEmiter = require('events');
const http = require('http');

class Sale extends EventEmiter {
  constructor() { super() };
};

const myEventEmmiter = new Sale();

myEventEmmiter.on('newSale', (orderNum) => {
  console.log(`Hello from newSale event, orderNum is ${orderNum}`);
});

myEventEmmiter.on('newSale', () => {
  console.log('My name is Bazinga');
});

myEventEmmiter.emit('newSale', 59);

// ---------------------------
const server = http.createServer();

server.listen(8080, '127.0.0.1', () => console.log('listening request...'));

server.on('request', (req, res) => res.end('received request'));

server.on('request', (req, res) => console.log('another request'));

server.on('close', () => console.log('server closed'));