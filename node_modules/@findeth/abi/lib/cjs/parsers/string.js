"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = void 0;

var _utils = require("../utils");

var _bytes = require("./bytes");

const string = {
  isDynamic: true,

  encode({
    buffer,
    value
  }) {
    return _bytes.bytes.encode({
      type: 'bytes',
      buffer,
      value: (0, _utils.fromUtf8)(value)
    });
  },

  decode(args) {
    return (0, _utils.toUtf8)(_bytes.bytes.decode(args));
  }

};
exports.string = string;
//# sourceMappingURL=string.js.map