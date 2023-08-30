const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
require('./models/index')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------ROUTERS------------------------
const userProfileRoute = require("./routes/userProfile");
const walletRoutes = require("./routes/walletRoutes")
const transactionRoutes  = require("./routes/transactionRoutes")
const keloWalletRoutes  = require("./routes/keloWalletRoutes")
//--------------------------------------------

app.use("/user", userProfileRoute);
app.use("/wallet", walletRoutes);
app.use("/transaction", transactionRoutes);
app.use("/transfer", keloWalletRoutes)

let port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server Listening at http://localhost:${port}`);
});
