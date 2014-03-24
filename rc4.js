"use strict";

// Based on RC4 algorithm, as described in
// http://en.wikipedia.org/wiki/RC4

function identityPermutation() {
  var s = new Array(256);
  for (var i = 0; i < 256; i++) {
    s[i] = i;
  }
  return s;
}

// :: string | array integer -> array integer
function seed(key) {
  if (typeof key === "string") {
    // to string
    key = "" + key;
    key = key.split("").map(function (c) { return c.charCodeAt(0) % 256; });
  } else if (Array.isArray(key)) {
    if (!key.every(function (v) {
      return typeof v === "number" && v === (v | 0);
    })) {
      throw new TypeError("invalid seed key specified: not array of integers");
    }
  } else {
    throw new TypeError("invalid seed key specified");
  }

  var keylen = key.length;

  // resed state
  var s = identityPermutation();

  var j = 0;
  for (var i = 0; i < 255; i++) {
    j = (j + s[i] + key[i % keylen]) % 256;
    var tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
  }

  return s;
}

function RC4(key) {
  this.s = seed(key);
  this.i = 0;
  this.j = 0;
}

RC4.prototype.randomByte = function () {
  this.i = (this.i + 1) % 256;
  this.j = (this.j + this.s[this.i]) % 256;

  var tmp = this.s[this.i];
  this.s[this.i] = this.s[this.j];
  this.s[this.j] = tmp;

  var k = this.s[(this.s[this.i] + this.s[this.j]) % 256];

  return k;
};

RC4.prototype.randomFloat = function () {
  var a = this.randomByte();
  var b = this.randomByte();
  var c = this.randomByte();
  var d = this.randomByte();

  var e = ((a * 256 + b) * 256 + c) * 256 + d;
  return e / 0x100000000;
};

RC4.prototype.currentState = function () {
  return {
    i: this.i,
    j: this.j,
    s: this.s.slice(), // copy
  };
};

RC4.prototype.setState = function(state) {
  var s = state.s;
  var i = state.i;
  var j = state.j;

  if (!(i === (i | 0) && 0 <= i && i < 256)) {
    throw new Error("state.i should be integer [0, 255]");
  }

  if (!(j === (j | 0) && 0 <= j && j < 256)) {
    throw new Error("state.i should be integer [0, 255]");
  }

  // check length
  if (!Array.isArray(s) || s.length !== 256) {
    throw new Error("state should be array of length 256");
  }

  // check that all params are there
  for (var k = 0; k < 256; k++) {
    if (s.indexOf(k) === -1) {
      throw new Error("state should be permutation of 0..255: " + k + " is missing");
    }
  }

  this.i = i;
  this.j = j;
  this.s = s.slice(); // assign copy
};

module.exports = RC4;
