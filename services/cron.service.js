const CronJob = require("cron/lib/cron").CronJob;
const axios = require("axios");
const CurrentWallet = require("../database/schemas/current_wallet.schema");
const ArchiveWallet = require("../database/schemas/archive-wallet.schema");
require('dotenv').config();


const job = new CronJob("0 */5 * * * *", async function () {
  let apikey = process.env.croneAPIKey ;

  let currentWalletIds = await CurrentWallet.find({}, "w_id");
  let addressString = "";
  currentWalletIds.forEach((object) => {
    addressString = addressString + object.w_id + ",";
  });
  addressString = addressString.slice(0, -1);

  let url = `https://api.bscscan.com/api?module=account&action=balancemulti&address=${addressString}&tag=latest&apikey=${apikey}`;

  try {
    const response = await axios.get(url);
    const filteredResponse = response.data.result;
    console.log(filteredResponse);
    let result = transferBalance();
    if (result) {
      updateCurrentWallet(filteredResponse);
    }
  } catch (err) {
    console.log("err");
    throw err;
  }
});

async function transferBalance() {
  try {
    const currentWallets = await CurrentWallet.find({}).exec();

    for (const currentWallet of currentWallets) {
      const existingArchiveWallet = await ArchiveWallet.findOne({
        w_id: currentWallet.w_id,
      }).exec();

      if (existingArchiveWallet) {
        existingArchiveWallet.balance += currentWallet.balance;
        await existingArchiveWallet.save();
      } else {
        const archiveWallet = new ArchiveWallet({
          w_id: currentWallet.w_id,
          balance: currentWallet.balance,
          lastUpdated: currentWallet.lastUpdated,
        });

        await archiveWallet.save();
      }
    }

    console.log("Balance transferred successfully");
    return true;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function updateCurrentWallet(filteredResponse) {
  try {
    for (const item of filteredResponse) {
      const { account, balance } = item;
      const existingWallet = await CurrentWallet.findOne({
        w_id: account,
      }).exec();

      if (existingWallet) {
        existingWallet.balance = Number(balance);
        await existingWallet.save();
      } else {
        const newWallet = new CurrentWallet({
          w_id: account,
          balance: Number(balance),
        });
        await newWallet.save();
      }
    }

    console.log("Update current wallet successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = job;
