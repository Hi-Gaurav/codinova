const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const path = require("path");

const exchangeSchema = new mongoose.Schema({
  exchange_id: String,
  name: String,
  website: String,
  data_quote_start: String,
  data_quote_end: String,
  data_orderbook_start: String,
  data_orderbook_end: String,
  data_trade_start: String,
  data_trade_end: String,
  data_symbols_count: String,
  volume_1hrs_usd: String,
  volume_1day_usd: String,
  volume_1mth_usd: String,
  icon_url: String,
});

const Exchange = mongoose.model("Exchange", exchangeSchema);

// const fetch = require("node-fetch");

function fetchDataFromAPI() {
  fetch(
    "https://rest.coinapi.io/v1/exchanges?apikey=FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9"
  )
    .then((response) => response.json())
    .then((data) => {
      saveToDatabase(data);
    })
    .catch((error) => console.error("Error fetching data from API:", error));
}

app.post("/fetch-data", (req, res) => {
  Promise.all([
    fetch(
      "https://rest.coinapi.io/v1/exchanges?apikey=FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9"
    ).then((res) => res.json()),
    fetch(
      "https://rest.coinapi.io/v1/exchanges/icons/24?apikey=FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9"
    ).then((res) => res.json()),
  ])
    .then(([exchanges, icons24]) => {
      // Assuming that you want to merge icons from both icon endpoints
      const allIcons = [...icons24];

      const mergedData = exchanges?.map((exchange) => {
        const icon = allIcons.find(
          (icon) => icon.exchange_id === exchange.exchange_id
        );
        return {
          ...exchange,
          icon_url: icon ? icon.url : null,
        };
      });

      const promises = mergedData.map((item) => {
        const exchange = new Exchange(item);
        return exchange.save();
      });

      return Promise.all(promises);
    })
    .then(() => res.send("Data fetched and saved successfully"))
    .catch((error) => {
      console.error("Error fetching data from API:", error);
      res.status(500).send("Error fetching data");
    });
});

app.get("/get-exchanges", (req, res) => {
  Exchange.find({})
    .then((data) => {
      res.json(data); // Send the fetched data as a JSON response
    })
    .catch((err) => {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retrieving data");
    });
});

app.listen(port, () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/codinova")
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => console.error("Could not connect to MongoDB...", err));
  console.log("Listening on port:", port);
});
