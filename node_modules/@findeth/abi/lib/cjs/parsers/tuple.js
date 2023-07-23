"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tuple = exports.getTupleElements = void 0;

var _packer = require("../packer");

const TUPLE_REGEX = /^\((.*)\)$/;

const getTupleElements = type => {
  return type.slice(1, -1).split(',').map(type => type.trim());
};

exports.getTupleElements = getTupleElements;
const tuple = {
  isDynamic(type) {
    const elements = getTupleElements(type);
    return elements.some(element => {
      const parser = (0, _packer.getParser)(element);
      return (0, _packer.isDynamicParser)(parser, element);
    });
  },

  isType(type) {
    return TUPLE_REGEX.test(type);
  },

  encode({
    type,
    buffer,
    value
  }) {
    const elements = getTupleElements(type);
    return (0, _packer.pack)(elements, value, buffer);
  },

  decode({
    type,
    value,
    skip
  }) {
    const elements = getTupleElements(type);
    const length = elements.length * 32 - 32;

    if (!(0, _packer.isDynamicParser)(this, type)) {
      skip(length);
    }

    return (0, _packer.unpack)(elements, value);
  }

};
exports.tuple = tuple;
//# sourceMappingURL=tuple.js.map