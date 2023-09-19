const express = require("express");
const bodyParser = require('body-parser');
const registerRoute = require('./routes/user-register.route');
const editUserDetails = require('./routes/user-details-edit.route');
const addWallets = require('./routes/user-wallet.route');

const app = express();
app.use(bodyParser.json());

const job = require("./services/cron.service");
const dbConnect = require("./database/db-connection");

dbConnect();

app.use('/auth', registerRoute);
app.use('/edituserdetails', editUserDetails);
app.use('/wallets',addWallets);


job.start();

app.listen(3000, () => console.log("serverstarted"));

module.exports = app;
