import { addPadding, concat, toBuffer, toNumber } from '../utils';
export const bytes = {
  isDynamic: true,

  encode({
    buffer,
    value
  }) {
    const bufferValue = toBuffer(value);
    const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;
    return concat([buffer, toBuffer(bufferValue.byteLength), addPadding(bufferValue, paddedSize)]);
  },

  decode({
    value
  }) {
    const buffer = value.slice(0, 32);
    const length = Number(toNumber(buffer));
    return value.subarray(32, 32 + length);
  }

};
//# sourceMappingURL=bytes.js.map