"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.address = void 0;

var _utils = require("../utils");

const address = {
  isDynamic: false,

  encode({
    buffer,
    value
  }) {
    const addressBuffer = (0, _utils.fromHex)((0, _utils.stripPrefix)(value).padStart(64, '0'));
    return (0, _utils.concat)([buffer, addressBuffer]);
  },

  decode({
    value
  }) {
    return `0x${(0, _utils.toHex)(value.slice(12, 32))}`;
  }

};
exports.address = address;
//# sourceMappingURL=address.js.map