import { concat, fromHex, stripPrefix, toHex } from '../utils';
export const address = {
  isDynamic: false,

  encode({
    buffer,
    value
  }) {
    const addressBuffer = fromHex(stripPrefix(value).padStart(64, '0'));
    return concat([buffer, addressBuffer]);
  },

  decode({
    value
  }) {
    return `0x${toHex(value.slice(12, 32))}`;
  }

};
//# sourceMappingURL=address.js.map