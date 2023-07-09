// console.log(arguments); // length: 5, [ exports, require, module, __filename, __dirname ]
// console.log(require('module').wrapper);

// 1. module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(2, 6));

// 2. exports
// const calc2 = require('./test-module-2');
const { add, subtract, multiply, divide } = require('./test-module-2');
console.log(multiply(2, 6));

// catching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();