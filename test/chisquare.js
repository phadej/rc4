/* global describe, it */
"use strict";

var RC4 = require("../rc4.js");
var assert = require("assert");

function sq(x) {
  return x * x;
}

// http://sites.stat.psu.edu/~mga/401/tables/Chi-square-table.pdf
var chi15p1 = 5.229;
// var chi15p5 = 7.261;
// var chi15p10 = 8.547;
// var chi15p90 = 22.307;
// var chi15p95 = 24.996;
var chi15p99 = 30.578;

var chi1p1 = 0.000;
var chi1p99 = 6.635;

describe("constructor", function () {
  it("takes string as seed", function () {
    var rc4 = new RC4("lol");

    assert.equal(rc4.randomByte(), 65);
  });

  it("takes array of integers as seed", function () {
    var rc4 = new RC4([1, 2, 3]);

    assert.equal(rc4.randomByte(), 151);
  });

  it("throws if given array of non integers", function () {
    assert.throws(function () {
      var rc4 = new RC4([Infinity]);
      rc4.randomByte();
    });

    assert.throws(function () {
      var rc4 = new RC4([NaN]);
      rc4.randomByte();
    });

    assert.throws(function () {
      var rc4 = new RC4(["foo"]);
      rc4.randomByte();
    });
  });

  it("throws if given something else", function () {
    assert.throws(function () {
      var rc4 = new RC4(123);
      rc4.randomByte();
    });
  });
});

describe("randomFloat", function () {
  it("returns values ∈ [0, 1)", function () {
    var rc4 = new RC4("deadbeef");
    var N = 10000;
    var smaller = 0;
    for (var i = 0; i < N; i++) {
      var r = rc4.randomFloat();
      assert(0 <= r && r < 1, "float should be in range of [0, 1)");

      if (r < 0.5) {
        smaller += 1;
      }
    }

    var chi = (sq(smaller - N/2) + sq((N - smaller) - N/2)) / (N/2);
    assert(chi1p1 < chi && chi < chi1p99);
  });
});

describe("currentState + setState", function () {
  it("can be used to reproduce values", function () {
    var rc4 = new RC4("deadbeef");
    var state = rc4.currentState();
    var N = 100;

    function generate() {
      var result = new Array(N);
      for (var i =0; i < N; i++) {
        result[i] = rc4.randomFloat();
      }
      return result;
    }

    var a = generate();
    rc4.setState(state);
    var b = generate();

    assert.deepEqual(a, b, "generated sequences should be equal");
  });

  it("throws an error if state is invalid", function () {
    assert.throws(function () {
      var rc4 = new RC4("deadbeef");
      var state = rc4.currentState();
      state.i = "foo";
      rc4.setState(state);
    });

    assert.throws(function () {
      var rc4 = new RC4("deadbeef");
      var state = rc4.currentState();
      state.j = "foo";
      rc4.setState(state);
    });

    assert.throws(function () {
      var rc4 = new RC4("deadbeef");
      var state = rc4.currentState();
      state.s.pop();
      rc4.setState(state);
    });

    assert.throws(function () {
      var rc4 = new RC4("deadbeef");
      var state = rc4.currentState();
      state.s[0] = state.s[1];
      rc4.setState(state);
    });
  });
});

describe("χ² tests", function () {
  var rc4 = new RC4("deadbeef");

  function run(N) {
      var i;
      var high = new Array(16);
      var low = new Array(16);
      for (i = 0; i < 16; i++) {
        high[i] = low[i] = 0;
      }

      for (i = 0; i < N; i++) {
        var b = rc4.randomByte();
        var l = b % 16;
        var h = (b - l) / 16;

        high[h] += 1;
        low[l] += 1;
      }

      var chih = 0;
      var chil = 0;

      for (i = 0; i < 16; i++){
        var nps = N/16;
        chih += sq(high[i] - nps)/nps;
        chil += sq(low[i] - nps)/nps;
      }

      // console.info("high χ² = " + chih);
      // console.info("low χ² = " + chil);

      return (chi15p1 < chih && chih < chi15p99) &&
        (chi15p1 < chil && chil < chi15p99);
  }

  function chisqurareit(N, n) {
    it("N = " + N + " - " + n + ". run", function () {
      var a = run(N);
      var b = run(N);
      var c = run(N);

      // only one may fail
      assert(a || b);
      assert(b || c);
    });
  }

  [1000, 10000, 100000].forEach(function (N) {
    [1, 2, 3].forEach(function (n) {
      chisqurareit(N, n);
    });
  });
});
