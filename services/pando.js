const BigNumber = require("bignumber.js");
// const Ethereum = require("./Ethereum");
const PandoJS = require("./pandojs.esm");
const RLP = require("eth-lib/lib/rlp");
const Bytes = require("eth-lib/lib/bytes");
require("dotenv").config();

class Pando {
  static _chainId = process.env.CHAIN_ID;
  static setChainID(newChainID) {
    this._chainId = newChainID;
  }

  static getChainID() {
    return this._chainId;
  }

  // static getTransactionExplorerUrl(transaction) {
  //     const chainId = this.getChainID();
  //     const urlBase = NetworkExplorerUrls[chainId];

  //     return `${urlBase}/txs/${transaction.hash}`;
  // }

  static getTransactionFee() {
    //10^12 PTOWei
    return 0.3;
  }

  static getSmartContractGasPrice() {
    //10^12 x 4 TFuelWei
    return 0.00004;
  }

  unsignedSendTx(txData, sequence, type = 1) {
    let { tokenType, from, to, amount, transactionFee } = txData;

    transactionFee = transactionFee;
    transactionFee = 10;
    const ten18 = new BigNumber(10).pow(18);
    const ten16 = new BigNumber(10).pow(16);
    const pandoWeiToSend =
      tokenType === "PTX"
        ? new BigNumber(0).multipliedBy(ten18)
        : new BigNumber(0);
    const ptoWeiToSend =
      tokenType === "PTX"
        ? new BigNumber(amount).multipliedBy(ten18)
        : new BigNumber(0);
    const feeInPTOWei = new BigNumber(transactionFee).multipliedBy(ten16); // Any fee >= 10^12 PTOWei should work, higher fee yields higher priority
    const senderAddr = from;
    const receiverAddr = to;
    const senderSequence = sequence;
    const outputs = [
      {
        address: receiverAddr,
        pandowei: pandoWeiToSend,
        ptxwei: ptoWeiToSend,
      },
    ];
    let tx;

    tx = new PandoJS.SendTx(senderAddr, outputs, feeInPTOWei, senderSequence);

    return tx;
  }

  static isHolderSummary(holderSummary) {
    if (holderSummary) {
      let expectedLen = 458;

      if (holderSummary.startsWith("0x")) {
        expectedLen = expectedLen + 2;
      }

      return holderSummary.length === expectedLen;
    } else {
      return false;
    }
  }

  signTransaction(unsignedTx, privateKey) {
    let chainID = Pando.getChainID();
    // let unsignedTx = Pando.unsignedSendTx(txData, sequence);
    let signedRawTxBytes = PandoJS.TxSigner.signAndSerializeTx(
      chainID,
      unsignedTx,
      privateKey
    );
    let signedTxRaw = signedRawTxBytes.toString("hex");

    //Remove the '0x' until the RPC endpoint supports '0x' prefixes
    signedTxRaw = signedTxRaw.substring(2);

    if (signedTxRaw) {
      return signedTxRaw;
    } else {
      throw new Error("Failed to sign transaction.");
    }
  }

  static prepareTxPayload(unsignedTx) {
    let chainID = Pando.getChainID();
    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(unsignedTx.getType()));
    let encodedTx = RLP.encode(unsignedTx.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);
    return payload.toString("hex");
  }
}
module.exports = new Pando();
