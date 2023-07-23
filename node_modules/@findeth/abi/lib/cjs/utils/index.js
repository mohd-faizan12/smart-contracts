"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buffer = require("./buffer");

Object.keys(_buffer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _buffer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _buffer[key];
    }
  });
});

var _twosComplement = require("./twos-complement");

Object.keys(_twosComplement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _twosComplement[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _twosComplement[key];
    }
  });
});
//# sourceMappingURL=index.js.map