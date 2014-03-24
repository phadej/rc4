var RC4 = require("./rc4.js");

var generator = new RC4("my seed"); // string or array of integers

// byte := integer ∈ [0, 255]
console.log(generator.randomByte());

// float := number ∈ [0, 1)
console.log(generator.randomFloat());

// save & load state
var state = generator.currentState();
console.log(generator.randomFloat()); // 0.14815412228927016
generator.setState(state);
console.log(generator.randomFloat()); // 0.14815412228927016

var RC4small = require("./rc4.js").RC4small;

var generator = new RC4small("my other seed");

var state = generator.currentStateString(); // 18 character hexadecimal string
console.log(generator.randomFloat());  // 0.9362740234937519
generator.setStateString(state);
console.log(generator.randomFloat()); // 0.9362740234937519
