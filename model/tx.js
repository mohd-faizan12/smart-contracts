const mongoose = require("mongoose");

const txnSchema = new mongoose.Schema({
  address: {
    type: String,
    require: true,
  },
  usdtTxHash: {
    type: String,
    require: true,
  },
  ctxptTxHash: {
    type: String,
    require: true,
  },
  usdtValue: {
    type: Number,
    default: 0,
  },
  CTXPT: {
    type: Number,
    default: 0,
  },

  ctxptTransferred: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("userTxn", txnSchema);
