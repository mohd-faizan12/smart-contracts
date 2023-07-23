"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iterate = void 0;

const iterate = function* (buffer, size = 32) {
  for (let pointer = 0; pointer < buffer.length; pointer += size) {
    const skip = length => {
      if (length % size !== 0) {
        throw new Error('Length must be divisible by size');
      }

      pointer += length;
    };

    const value = buffer.subarray(pointer);
    yield {
      skip,
      value
    };
  }

  return {
    skip: () => undefined,
    value: new Uint8Array()
  };
};

exports.iterate = iterate;
//# sourceMappingURL=iterator.js.map