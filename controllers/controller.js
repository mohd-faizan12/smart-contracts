// To Use env file Variables
require("dotenv").config();
const logger = require(".././services/logger");
const txSchema = require(".././model/tx");
const axios = require("axios");
const { encode, toHex } = require("@findeth/abi");
const Provider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const paymentServices = require(".././services/payment");
const TronWeb = require("tronweb");
const { Web3Auth } = require("@web3auth/modal");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
// Artifact of uniblokContract smart contract
const compileData = require("../artifacts/contracts/certificate.sol/GenerateCertificate.json");
const compiledData = require("../artifacts/contracts/UniblokContract.sol/UniblokContract.json");
// const { TimestreamQuery } = require("aws-sdk");

class deployContractsAndFetchContractData {
  /**
     * @desc deploy smart contract on pando blockchain
    
     * @returns {address} contract address
     */
  async deployContract(req, res, next) {
    try {
      const {
        email,
        certName,
        CertificationLevel,
        creationDate,
        certId,
        fees,
        maximumMarks,
        marks,
      } = req.body;
      const buffer = encode(
        [
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "uint256",
          "uint256",
          "uint256",
        ],
        [
          req.body.email,
          req.body.certName,
          req.body.CertificationLevel,
          "@Pando Labs", //issuer name
          "pandoLabs@231ch", //issuer id
          "Mr. chandan Lunthi", // issued by
          "CTO", //designation of who issued cert.
          req.body.creationDate,
          req.body.certId,
          req.body.fees,
          req.body.maximumMarks,
          req.body.marks,
        ]
      );
      const web3 = await new Web3(process.env.rpcURL);
      const account = await web3.eth.accounts.wallet.add(
        `0x${process.env.PRIVATE_KEY}`
      );
      let abi = compileData.abi;
      let contractBytecode = compileData.bytecode;
      const result = await new web3.eth.Contract(abi)
        .deploy({
          data: contractBytecode,
          arguments: [
            email,
            certName,
            CertificationLevel,
            ["@Pando Labs", "pandoLabs@231ch", "Mr. chandan Lunthi", "CTO"],
            creationDate,
            certId,
            fees,
            maximumMarks,
            marks,
          ],
        })
        .send({ from: account.address, gas: 2000000 });
      const address = result.options.address;
      const contract = fs.readFileSync("./contracts/certificate.sol", "utf-8");
      const data = {
        abi: "0x" + toHex(buffer),
        optimizer: "0",
        sourceCode: contract,
        version: "0.8.7",
        versionFullName: "soljson-v0.8.7+commit.e28d00a7.js",
      };

      const results = await axios.post(
        `https://testnet.explorerapi.pandoproject.org/api/smartcontract/verify/${address}`,
        data
      );

      if (!results || !results.data.result.verified) {
        res.status(500).json({
          message: "contract could not be verified",
        });
        console.log("contract could not be verified");
      } else {
        console.log(results.data);
        logger.info(`200 : Contract deployed to : ${result.options.address}`);
        res.status(200).json({
          address: result.options.address,
        });
      }
    } catch (error) {
      console.log("err", error);
      logger.error(`500: error: ${error.message}`);
      return res
        .status(500)
        .json({ Error: "error while deploying smart contract" + error });
    }
  }
  async getCertDetails(req, res) {
    try {
      const contractAddress = req.params.address;
      const web3 = await new Web3(process.env.rpcURL);
      let abi = compileData.abi;

      const contract = new web3.eth.Contract(abi, contractAddress);

      const data = await contract.methods.certificate().call();

      const datas = {
        email: data.email,
        certName: data.certName,
        CertificationLevel: data.CertificationLevel,
        issuerName: data.issuerName,
        issuerId: data.issuerId,
        issuedBy: data.issuedBy,
        issuedByDesgnation: data.issuedByDesgnation,
        creationDate: data.creationDate,
        certId: data.certId,
        fees: data.fees,
        maximumMarks: data.maximumMarks,
        marks: data.marks,
      };

      console.log("fetched data successfully");

      logger.info(`200: output: ${datas}`);

      return res.status(200).json({
        output: datas,
      });
    } catch (err) {
      console.log("error :", err);
      logger.error(`500: error: ${err}`);
      return res.status(500).json({
        error: "error while fetching data :" + err,
      });
    }
  }

  async deployUniContract(req, res, next) {
    try {
      const {
        jobTitle,
        clientName,
        serviceProvider,
        estimatedBudget,
        estimatedHours,
        estimatedWeek,
        estimatedTeamSize,
        netSettlement,
        uniblokServiceFee,
        expectedAmountToBeReceived,
        finalAmount,
        jobCategory,
        OfferDate,
        offerExpires,
        expectedCompletionOn,
        jobId,
        acceptanceTime,
        acceptanceDate,
      } = req.body;
      const buffer = encode(
        [
          "string",
          "string",
          "string",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
        ],
        [
          req.body.jobTitle,
          req.body.clientName,
          req.body.serviceProvider,
          req.body.estimatedBudget,
          req.body.estimatedHours,
          req.body.estimatedWeek,
          req.body.estimatedTeamSize,
          req.body.netSettlement,
          req.body.uniblokServiceFee,
          req.body.expectedAmountToBeReceived,
          req.body.finalAmount,
          req.body.jobCategory,
          req.body.OfferDate,
          req.body.offerExpires,
          req.body.expectedCompletionOn,
          req.body.jobId,
          req.body.acceptanceTime,
          req.body.acceptanceDate,
        ]
      );

      const web3 = await new Web3(process.env.rpcURL);
      const account = await web3.eth.accounts.wallet.add(
        `0x${process.env.PRIVATE_KEY}`
      );
      let abi = compiledData.abi;
      let contractBytecode = compiledData.bytecode;
      const result = await new web3.eth.Contract(abi)
        .deploy({
          data: contractBytecode,
          arguments: [
            [jobTitle, clientName, serviceProvider],
            [
              estimatedBudget,
              estimatedHours,
              estimatedWeek,
              estimatedTeamSize,
              netSettlement,
            ],
            [uniblokServiceFee, expectedAmountToBeReceived, finalAmount],
            [
              jobCategory,
              OfferDate,
              offerExpires,
              expectedCompletionOn,
              jobId,
              acceptanceTime,
              acceptanceDate,
            ],
          ],
        })
        .send({ from: account.address, gas: 2000000 });

      const address = result.options.address;
      const contract = fs.readFileSync(
        "./contracts/UniblokContract.sol",
        "utf-8"
      );
      const data = {
        abi: "0x" + toHex(buffer),
        optimizer: "0",
        sourceCode: contract,
        version: "0.8.7",
        versionFullName: "soljson-v0.8.7+commit.e28d00a7.js",
      };

      const results = await axios.post(
        `https://testnet.explorerapi.pandoproject.org/api/smartcontract/verify/${address}`,
        data
      );

      if (!results || results.data.result.verified == false) {
        res.status(500).json({
          message: "contract could not be verified",
        });
        console.log("contract could not be verified");
      }
      logger.info(`200 : Contract deployed to : ${result.options.address}`);
      res.status(200).json({
        address: result.options.address,
      });
      console.log(
        "Contract is finally deployed and the address is",
        result.options.address
      );
    } catch (error) {
      console.log("err", error);
      logger.error(`500: error: ${error.message}`);
      return res.status(500).json({ Error: "Internal Server Error" + error });
    }
  }
  async getContractDetails(req, res) {
    try {
      const contractAddress = req.params.address;
      const web3 = await new Web3(process.env.rpcURL);
      let abi = compiledData.abi;

      const contract = new web3.eth.Contract(abi, contractAddress);

      const data1 = await contract.methods.partyDetail().call();

      const data2 = await contract.methods.ContractOverview().call();

      const data3 = await contract.methods.ServiceChargeDetails().call();

      const data4 = await contract.methods.TypeAndDuration().call();

      const datas = {
        jobTitle: data1.jobTitle,
        clientName: data1.clientName,
        serviceProvider: data1.serviceProvider,
        estimatedBudget: data2.estimatedBudget,
        estimatedHours: data2.estimatedHours,
        estimatedWeek: data2.estimatedWeek,
        estimatedTeamSize: data2.estimatedTeamSize,
        netSettlement: data2.netSettlement,
        uniblokServiceFee: data3.uniblokServiceFee,
        expectedAmountToBeReceived: data3.expectedAmountToBeReceived,
        finalAmount: data3.finalAmount,
        jobCategory: data4.jobCategory,
        OfferDate: data4.OfferDate,
        offerExpires: data4.offerExpires,
        expectedCompletionOn: data4.expectedCompletionOn,
        jobId: data4.jobId,
        acceptanceTime: data4.acceptanceTime,
        acceptanceDate: data4.acceptanceDate,
      };

      console.log("fetched data successfully");

      logger.info(`200: output: ${datas}`);

      return res.status(200).json({
        contract_Details: datas,
      });
    } catch (err) {
      console.log("error :", err);
      logger.error(`500: error: ${err}`);
      return res.status(500).json({
        error: "error while fetching data :" + err,
      });
    }
  }
  async verifyTxn(req, res, next) {
    try {
      const data = JSON.parse(JSON.stringify(req.body));
      if (!data.txhash) {
        return res.status(404).json({
          message: "please pass  transaction hash",
        });
      }

      const userdata = await txSchema.findOne({
        usdtTxHash: data.txhash,
      });

      const transactionHash = req.body.txhash;

      // const providerUrl = "https://api.avax.network/ext/bc/C/rpc";
      const providerUrl = "https://api.avax-test.network/ext/bc/C/rpc";
      const sepoliaProviderUrl = "https://eth-sepolia.g.alchemy.com/v2/demo";
      const web3 = new Web3(providerUrl);
      const WEB3 = new Web3(sepoliaProviderUrl);
      let receiverAddress;
      let amount;
      const trx_receipt = await web3.eth.getTransactionReceipt(transactionHash);
      if (trx_receipt == null) {
        const ethTxReceipt = await WEB3.eth.getTransactionReceipt(
          transactionHash
        );
        console.log("transaction detail :", ethTxReceipt);
        if (!ethTxReceipt.from) {
          return res.status(404).json({
            message: "Invalid hash",
          });
        }
        receiverAddress = ethTxReceipt.from;

        if (!ethTxReceipt.status || userdata != null) {
          return res.status(404).json({
            message:
              "Either transaction is not completed yet or CTXPT already transferred",
          });
        }
      }
      if (trx_receipt != null) {
        if (trx_receipt.status == true) {
          if (!trx_receipt.from) {
            return res.status(404).json({
              message: "Invalid hash",
            });
          }
          receiverAddress = trx_receipt.from;
          if (!trx_receipt.status || userdata != null) {
            return res.status(404).json({
              message:
                "Either transaction is not completed yet or CTXPT already transferred",
            });
          }
        } else {
          return res.status(404).json({
            message: " transaction is not completed yet ",
          });
        }
      }
      const add = await web3.eth.getTransaction(transactionHash);
      if (add == null) {
        const val = await WEB3.eth.getTransaction(transactionHash);
        let str = val.input.substring(10);
        const datas = web3.eth.abi.decodeParameters(
          ["address", "uint256"],
          str
        );
        amount = datas[1];
        if (datas[0] != process.env.usdtAdminWallet) {
          amount = datas[1];
          return res.status(404).json({
            message: "USDT were not sent to our admin wallet address",
          });
        }
        console.log("data :", datas);
      }

      if (add != null) {
        let str = add.input.substring(10);
        const datas = web3.eth.abi.decodeParameters(
          ["address", "uint256"],
          str
        );
        amount = datas[1];

        if (datas[0] != process.env.usdtAdminWallet) {
          return res.status(404).json({
            message: "USDT were not sent to our admin wallet address",
          });
        }
      }

      let senderPrivateKey = process.env.PRIVATE_KEY;
      let ctxptPrice = process.env.CTXPT_VALUE;

      let finalAmount = amount / 1000000;

      let conversion = finalAmount / ctxptPrice;
      const datass = new txSchema({
        address: receiverAddress,
        usdtTxHash: transactionHash,
        usdtValue: finalAmount,
        CTXPT: conversion,
        ctxptTransferred: false,
      });

      await datass.save();
      const body = {
        amount: conversion,
        senderPrivateKey: senderPrivateKey,
        recipientAddr: receiverAddress,
      };
      let ctxptTransfer = await axios.post(
        `http://13.228.90.38:5002/ctxtransfer`,
        body
      );
      let txnHash = ctxptTransfer.data["Transaction Detail"].transactionHash;
      let contractAdd =
        ctxptTransfer.data["Transaction Detail"].contractAddress;
      if (ctxptTransfer) {
        datass["ctxptTxHash"] = txnHash;
        datass.ctxptTransferred = true;
        await datass.save();

        logger.info(`200 : CTXPT transferred successfully : ${ctxptTransfer}`);
        return res.status(200).json({
          result: {
            Success: true,
            ctxptTxHash: txnHash,
            contract: contractAdd,
            usdtTxHash: transactionHash,
          },
        });
      } else {
        logger.error(`400 : CTXPT could not be transferred `);

        return res.status(400).json({
          message: "error while transferring CTXPT",
        });
      }
    } catch (err) {
      console.log("error :", err);
      return res.status(200).json({
        error: "error :" + err,
      });
    }
  }
  async TotalUDT(req, res) {
    try {
      const data = await txSchema.aggregate([
        {
          $group: {
            _id: null,
            TotalUSDT: {
              $sum: "$usdtValue",
            },
          },
        },
      ]);
      console.log("sum :", data);
      return res.status(200).json({
        sum: data,
      });
    } catch (err) {
      console.log("error :", err);
      return res.status(400).json({
        error: "something went wrong" + err,
      });
    }
  }
  async txnHistory(req, res) {
    try {
      const { add } = req.params;
      if (add) {
        let data = await txSchema.find({ address: add });
        return res.status(200).json({
          result: data,
        });
      } else {
        return res.status(400).json({
          error: "Please pass a wallet address",
        });
      }
    } catch (err) {
      return res.status(400).json({
        error: "something went wrong" + err,
      });
    }
  }

  async usdtBalance(req, res) {
    try {
      const { add } = req.params;

      tronWeb.setAddress("TWbcHNCYzqAGbrQteKnseKJdxfzBHyTfuh");

      const contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

      const contractInstance = await tronWeb.contract().at(contractAddress);

      let balanceOf = await contractInstance.balanceOf(add).call();

      console.log("balance :", BigInt(balanceOf).toString());

      return res.status(200).json({
        balance: "balance is: " + BigInt(balanceOf).toString(),
      });
    } catch (err) {
      return res.status(400).json({
        error: "something went wrong" + err,
      });
    }
  }

  async verifyHash(req, res) {
    try {
      const providerUrl = "https://api.avax-test.network/ext/bc/C/rpc";
      const web3 = new Web3(providerUrl);
      const trx_receipt = await web3.eth.getTransactionReceipt(
        "0x4093d3b08503bbe2395f8513833c709ed53fdb15c89ee8f211ae28a6ddce22b0"
      );

      // const data = await web3.eth.getTransaction(
      //   "0x4093d3b08503bbe2395f8513833c709ed53fdb15c89ee8f211ae28a6ddce22b0"
      // );
      // let str = data.input.substring(10);
      // console.log(
      //   data,
      //   web3.eth.abi.decodeParameters(["address", "uint256"], str)
      // );
      console.log("data :", trx_receipt.status);
      return res.status(200).json({
        // message: web3.eth.abi.decodeParameters(["address", "uint256"], str),
        data: trx_receipt,
      });
    } catch (err) {
      console.log("error :", err);
      return res.status(200).json({
        error: "error :" + err,
      });
    }
  }

  async balanceOf(req, res) {
    try {
      const data = req.params.add;
      const balance = await axios.get(
        `http://13.228.90.38:5002/balanceofac?owner=${data}`
      );
      return res.status(200).json({
        data: "balance is : " + balance.data.result,
      });
    } catch (err) {
      return res.status(200).json({
        error: "error :" + err,
      });
    }
  }
}

module.exports = new deployContractsAndFetchContractData();
