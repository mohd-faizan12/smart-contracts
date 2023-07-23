"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bytes = void 0;

var _utils = require("../utils");

const bytes = {
  isDynamic: true,

  encode({
    buffer,
    value
  }) {
    const bufferValue = (0, _utils.toBuffer)(value);
    const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;
    return (0, _utils.concat)([buffer, (0, _utils.toBuffer)(bufferValue.byteLength), (0, _utils.addPadding)(bufferValue, paddedSize)]);
  },

  decode({
    value
  }) {
    const buffer = value.slice(0, 32);
    const length = Number((0, _utils.toNumber)(buffer));
    return value.subarray(32, 32 + length);
  }

};
exports.bytes = bytes;
//# sourceMappingURL=bytes.js.map