# rc4

RC4 random number generator

[![Build Status](https://secure.travis-ci.org/phadej/rc4.png?branch=master)](http://travis-ci.org/phadej/rc4)
[![NPM version](https://badge.fury.io/js/rc4.png)](http://badge.fury.io/js/rc4)
[![Dependency Status](https://gemnasium.com/phadej/rc4.png)](https://gemnasium.com/phadej/rc4)
[![Code Climate](https://codeclimate.com/github/phadej/rc4.png)](https://codeclimate.com/github/phadej/rc4)

## Synopsis

```js
var RC4 = require("rc4");

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
```
