const express = require("express");
const app = express();
const route = require("./route");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = 3001;
app.use(cors());
app.use(express.json());

app.use("/", route);

app.get("/", function (req, res) {
  res.send("server is running");
});

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://localhost/smart", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", (connected) => {
  console.log("Connected to db");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
mongoose.connection.on("error", function (err) {
  throw new Error(err);
});
// let transactionDao = new transactionDaoLib(__dirname, mongoClient, redis);
// bluebird.promisifyAll(transactionDao);
// setTransactionDao(transactionDao);
app.use(express.json());
