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
