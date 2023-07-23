const paymentServices = require("./payments");
const logger = require("../services/logger");
class ptxPayment {
  async payment(
    senderAddress,
    senderPrivateKey,
    receiverAddress,
    amount,
    res,
    next
  ) {
    try {
      if (!(senderAddress && senderPrivateKey && receiverAddress && amount)) {
        console.log("Please dont leave any field empty");

        logger.error("Please don't leave any field empty");
        return res.status(400).json({
          message: "Please don't leave any field empty",
        });
      }
      let result = await paymentServices.paymentService(
        senderAddress,
        senderPrivateKey,
        receiverAddress,
        amount,
        next
      );
      if (result && result.Success === true) {
        return { Succes: true, TxHash: result };
      }
    } catch (err) {
      console.log("error :", err);
      return res.status(500).json({
        message: "error :" + err,
      });
    }
  }
}
module.exports = new ptxPayment();
