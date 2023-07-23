import { fromUtf8, toUtf8 } from '../utils';
import { bytes } from './bytes';
export const string = {
  isDynamic: true,

  encode({
    buffer,
    value
  }) {
    return bytes.encode({
      type: 'bytes',
      buffer,
      value: fromUtf8(value)
    });
  },

  decode(args) {
    return toUtf8(bytes.decode(args));
  }

};
//# sourceMappingURL=string.js.map