const axios = require("axios");
const pando = require("./pando");
const logger = require("../services/logger");
class Payments {
  async paymentService(
    senderAddress,
    senderPrivateKey,
    receiverAddress,
    amount,
    next
  ) {
    try {
      senderAddress = senderAddress.startsWith("0x")
        ? senderAddress
        : "0x" + senderAddress;
      if (senderAddress.length !== 42) {
        console.log(
          "Sender wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        logger.error(
          "Sender wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        return res.status(404).json({
          message:
            "Sender wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      receiverAddress = receiverAddress.startsWith("0x")
        ? receiverAddress
        : "0x" + receiverAddress;
      if (receiverAddress.length !== 42) {
        console.log(
          "eceiver wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        logger.error(
          "Receiver wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        return res.status(404).json({
          message:
            "Receiver wallet is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
      if (senderPrivateKey.length !== 66) {
        console.log(
          "Sender privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        logger.error(
          "Sender privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res.status(404).json({
          message:
            "Sender privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string",
        });
      }
      if (senderAddress === receiverAddress) {
        console.log(
          "Duplicate address. Sender wallet and receiver wallet is same."
        );
        logger.error(
          "Duplicate address. Sender wallet and receiver wallet is same."
        );
        return res.status(404).json({
          message:
            "Duplicate address. Sender wallet and receiver wallet is same.",
        });
      }
      const body = {
        tokenType: "PTX",
        from: senderAddress,
        to: receiverAddress,
        amount: parseFloat(amount),
        transactionFee: 0,
      };
      const result = await axios.get(
        process.env.INTEREXPLOREAPI + `${senderAddress}`
      );
      if (result.data.type !== "account") {
        console.log(
          "Sender wallet is not a part of our environment, Please do some transaction on environment"
        );
        logger.error(
          "Sender wallet is not a part of our environment, Please do some transaction on environment"
        );
        return res.status(404).json({
          message:
            "Sender wallet is not a part of our environment, Please do some transaction on environment",
        });
      }
      let senderSequence = parseInt(result.data.body.sequence) + 1;
      const s = pando.unsignedSendTx(body, senderSequence);
      const txHash = pando.signTransaction(s, senderPrivateKey);
      const finalBody = {
        jsonrpc: "2.0",
        method: "pando.BroadcastRawTransactionAsync",
        params: [{ tx_bytes: txHash }],
        id: 1,
      };
      const resultnode = await axios.post(process.env.NODESERVICES, finalBody);
      if (resultnode.data.result) {
        logger.info("Transaction has done successfully");
        console.log("Transaction has done successfully");
        return { Success: true, TxHash: resultnode.data.result.hash };
      } else if (
        resultnode.data.error.message.startsWith(
          "Signature verification failed"
        )
      ) {
        console.log(
          "Please pass correct pair of sender wallet address and private key"
        );
        logger.error(
          "Please pass correct pair of sender wallet and private key"
        );
        return res.status(404).json({
          message: "Please pass correct pair of sender wallet and private key",
        });
      } else if (
        resultnode.data.error.message.startsWith("Insufficient fund")
      ) {
        console.log("This account doesn't have enough amount of PTX unit");

        logger.error("This account doesn't have enough amount pf PTX unit");
        return res.status(404).json({
          message: "This account doesn't have enough amount pf PTX unit",
        });
      } else {
        console.log("Request cannot be completed try after some time");

        logger.error("Request cannot be completed try after some time ");
        return res.status(404).json({
          message: "Request cannot be completed try after some time",
        });
      }
    } catch (err) {
      console.log("error :", err);
      return res.status(500).json({
        message: "error :" + err,
      });
    }
  }
}
module.exports = new Payments();
