const express = require("express");
const route = express.Router();

const controller = require("./controllers/controller");
const unibtcontroller = require("./controllers/unibtController");

route.post("/generate-certificate", controller.deployContract);

route.get("/get-output/:address", controller.getCertDetails);

route.post("/contract", controller.deployUniContract);

route.get("/contract-details/:address", controller.getContractDetails);

route.post("/verify-hash", controller.verifyTxn);

route.get("/total-usdt", controller.TotalUDT);

route.get("/txn-history/:add", controller.txnHistory);

// route.get("/verify", controller.verifyHash);

route.get("/balance-of/:add", controller.balanceOf);

route.post("/send-unibt", unibtcontroller.sendUNIBTtoReceiverAdd);


// route.get("/usdt-balance/:add", controller.usdtBalance);  //tron usdt



module.exports = route;
