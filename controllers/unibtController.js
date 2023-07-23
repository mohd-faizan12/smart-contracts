// To Use env file Variables
require("dotenv").config();
const Web3 = require("web3");
const compileData = require("../artifacts/contracts/UNIBT.sol/UNIBT.json");
// To print statements on terminal without using
const logger = require("../services/logger");

class Token {
  /**
   * @desc do transaction for unitoken to other adresses
   * @param {string} recipientAddr whom address we want to send some token.
   * @param {number} UNIBTAmountInWei manipulate with token amount
   */
  async transferuni(req, res) {
    try {
      let { amount, senderPrivateKey } = req.body;
      const value = amount;
      const UNIBTAmountInWei = Web3.utils.toWei(`${value}`, "ether");

      // recipientAddr = recipientAddr.startsWith("0x")
      //     ? recipientAddr
      //     : "0x" + recipientAddr;
      // if (recipientAddr.length !== 42) {
      //     logger.error(
      //         "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
      //     );
      //     return res
      //         .status(404)
      //         .send(
      //             "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
      //         );
      // }

      senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
      if (senderPrivateKey.length !== 66) {
        logger.error(
          "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      const account = await web3.eth.accounts.wallet.add(senderPrivateKey);
      logger.info(`200 : Account address : ${account.address}`);

      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let dataFunction;
      if (process.env.recipientAddr && UNIBTAmountInWei) {
        dataFunction = contract.methods
          .transfer(process.env.recipientAddr, UNIBTAmountInWei)
          .encodeABI();
      }

      if (!dataFunction) {
        return res.status(404).json({ Error: "please pass all feilds" });
      }
      const count = await web3.eth.getTransactionCount(account.address);

      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: account.address,
          nonce: web3.utils.toHex(count),
          gas: web3.utils.toHex(10000000),
          to: process.env.Contract_Adress,
          data: dataFunction,
        },
        senderPrivateKey
      );

      // Deploy transaction
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      logger.info(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      logger.info(
        `Transaction details: ${JSON.stringify(createReceipt, null, "  ")}`
      );
      res.status(200).json({ "Transaction Detail": createReceipt });
    } catch (err) {
      logger.error(`404: error: ${err.message}`);
      res.status(404).json({
        Error: "please pass all feilds correct",
        message: err.toString(),
      });
    }
  }
  async sendUNIBTtoReceiverAdd(req, res) {
    try {
      let { recipientAddr, amount } = req.body;

      const value = amount;
      const UNIBTAmountInWei = Web3.utils.toWei(`${value}`, "ether");

      // recipientAddr = recipientAddr.startsWith("0x")
      //     ? recipientAddr
      //     : "0x" + recipientAddr;
      // if (recipientAddr.length !== 42) {
      //     logger.error(
      //         "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
      //     );
      //     return res
      //         .status(404)
      //         .send(
      //             "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
      //         );
      // }
      let senderPrivateKey = process.env.UNIBT_ADMIN_PrivateKey;
      senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
      if (senderPrivateKey.length !== 66) {
        logger.error(
          "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      const account = await web3.eth.accounts.wallet.add(senderPrivateKey);
      if (account.address == recipientAddr) {
        return res.status(404).json({
          Error: "Owner and recipient address can not be the same",
        });
      }
      logger.info(`200 : Account address : ${account.address}`);

      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let dataFunction;
      if (recipientAddr && UNIBTAmountInWei) {
        dataFunction = contract.methods
          .transfer(recipientAddr, UNIBTAmountInWei)
          .encodeABI();
      }

      if (!dataFunction) {
        return res.status(404).json({ Error: "please pass all feilds" });
      }
      const count = await web3.eth.getTransactionCount(account.address);

      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: account.address,
          nonce: web3.utils.toHex(count),
          gas: web3.utils.toHex(10000000),
          to: process.env.Contract_Adress,
          data: dataFunction,
        },
        senderPrivateKey
      );

      // Deploy transaction
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      logger.info(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      logger.info(`Transaction details: ${JSON.stringify(createReceipt)}`);
      res.status(200).json({ "Transaction Detail": createReceipt });
    } catch (err) {
      logger.error(`404: error: ${err.message}`);
      res.status(404).json({
        Error: "Error while transferrring UNIBT",
        message: err.toString(),
      });
    }
  }

  // /**
  //    * @desc
  //    * @author vishal mendiratta
  //    * @param {string} recipientAddr whom address we want to send uni token.
  //    * @param {number} UNIBTAmountInWei manipulate with token amount
  //    * @returns {number, string, boolean} return particular type of data
  //   api body-
  //  {
  //     "recipientAddr" :"0xe4860f8f2342F0fe3D0d30A0A3211EA8248a8254",
  //      "UNIBTAmountInETH" : 10
  //  }
  //    */
  // async mintuni(req, res) {
  //     try {
  //         let { recipientAddr, UNIBTAmountInETH } = req.body;
  //         const value = UNIBTAmountInETH;
  //         const UNIBTAmountInWei = Web3.utils.toWei(`${value}`, "ether");

  //         recipientAddr = recipientAddr.startsWith("0x")
  //             ? recipientAddr
  //             : "0x" + recipientAddr;
  //         if (recipientAddr.length !== 42) {
  //             logger.error(
  //                 "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
  //             );
  //             return res
  //                 .status(404)
  //                 .send(
  //                     "recipientAddr is invalid, Please pass 40 or 42 bits long alpha-numeric string"
  //                 );
  //         }
  //         // SENDER_PRIVATE_KEY = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : "0x" + PRIVATE_KEY
  //         // if (PRIVATE_KEY.length !== 66) {
  //         //     logger.error("privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string");
  //         //     return res.status(404).send("privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string");
  //         // }

  //         const web3 = await new Web3(
  //             "https://testnet.ethrpc.pandoproject.org/rpc"
  //         );
  //         logger.info(
  //             `200 : Web3 connection with Blockchain has built successfully`
  //         );
  //         const account = await web3.eth.accounts.wallet.add(
  //             process.env.PRIVATE_KEY
  //         );
  //         logger.info(`200 : Account address : ${account.address}`);

  //         let abi = compileData.abi;
  //         const contract = await new web3.eth.Contract(
  //             abi,
  //             process.env.Contract_Adress
  //         );
  //         let dataFunction;

  //         if (recipientAddr && UNIBTAmountInWei) {
  //             //     const decimals = 18;
  //             //     const input = pdropAmountInETH; // Note: this is a string, e.g. user input
  //             //    // const amount = ethers.utils.parseUnits(input, decimals)
  //             //     const amount = BigNumber.from(input).mul(BigNumber.from(10).pow(decimals));
  //             dataFunction = contract.methods
  //                 .mint(recipientAddr, UNIBTAmountInWei)
  //                 .encodeABI();
  //         }

  //         if (!dataFunction) {
  //             return res.status(404).send("Method name not found");
  //         }
  //         const count = await web3.eth.getTransactionCount(account.address);

  //         const createTransaction = await web3.eth.accounts.signTransaction(
  //             {
  //                 from: account.address,
  //                 nonce: web3.utils.toHex(count),
  //                 gas: web3.utils.toHex(10000000),
  //                 to: process.env.Contract_Adress,
  //                 data: dataFunction,
  //             },
  //             process.env.PRIVATE_KEY
  //         );

  //         // Deploy transaction
  //         const createReceipt = await web3.eth.sendSignedTransaction(
  //             createTransaction.rawTransaction
  //         );
  //         logger.info(
  //             `Transaction successful with hash: ${createReceipt.transactionHash}`
  //         );
  //         logger.info(
  //             `Transaction details: ${JSON.stringify(createReceipt, null, "  ")}`
  //         );
  //         res.status(200).json({ "Transaction Detail": createReceipt });
  //     } catch (err) {
  //         console.log("err", err);
  //         logger.error(`500: error: ${err.message}`);
  //         res.status(500).json({ Error: "Internal Server Error" });
  //     }
  // }

  /**
   * @author vishal mendiratta
   * @param {string} owner who has deploy the smart contract or has owner of particular supply of token
   * @returns {number, string, boolean} return particular type of data
   */
  async balanceOfac(req, res) {
    try {
      let { owner } = req.query;
      owner = owner.startsWith("0x") ? owner : "0x" + owner;
      if (owner.length !== 42) {
        logger.error(
          "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }
      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      // const account = await web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY}`);
      // logger.info(`200 : Account address : ${account.address}`);
      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let result;

      if (owner) {
        result = await contract.methods.balanceOf(owner).call();
        console.log(result);
      }

      if (!result) {
        return res.status(404).send("please pass all feilds");
      }
      let resultString = `Contract call for balanceof and result is `;
      res.json({ resultString, result });
    } catch (error) {
      logger.error(`404: error: ${error.message}`);
      res.status(404).json({
        Error: "please pass all feilds correct",
        message: error.message.toString(),
      });
    }
  }
}
module.exports = new Token();
