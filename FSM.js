const { parentPort, workerData, isMainThread } = require("worker_threads");
var fs = require("fs");
const _ = require("lodash");
const path = require("path");
let { Decimal } = require("decimal.js");

let startTime = 0;
if (!isMainThread) {
  let dataHash = {};
  parentPort.on("message", msg => {
    if (typeof msg === "object") {
      if (startTime === 0) {
        startTime = "-" + msg.TS2;
      }

      let timeDelay = Decimal.add(msg.TS2, startTime);

      if (!timeDelay.equals(0)) {
        let barCalculated = Math.round(timeDelay.dividedBy(15000000000));
        DataParser(msg, dataHash, barCalculated);
      } else {
        DataParser(msg, dataHash, 1);
      }
    }
  });
  parentPort.on("message", stock => {
    if (typeof stock === "string") {
      console.log("stock: ", stock);
      var writeStream = fs.createWriteStream(
        path.join(__dirname, "/data.text")
      );
      if (dataHash[stock]) {
        parentPort.postMessage(JSON.stringify(dataHash[stock]));
      }
    }
  });
}

function DataParser(msg, dataHash, barCalculated) {
  const stockData = msg;
  function Set(bar, vol = null) {
    if (!vol) {
      dataHash[stockData.sym] = [];
    }
    const { sym } = stockData;
    dataHash[sym].push({
      event: "ohlc_notify",
      symbol: stockData.sym,
      bar: bar,
      o: stockData.P,
      h: stockData.P,
      l: stockData.P,
      c: stockData.P,
      volume: !vol ? stockData.Q : vol,
      timeStamp : Decimal.round(Decimal.div(stockData.TS2,1000000))
    });
  } //setup the initial values
  function Reset() {
    const Stockdata = dataHash[stockData.sym];
    const latestStockdata = Stockdata[Stockdata.length - 1];
    latest.c = stockData.P;
    Set(++latest.bar, latest.volume);
  }

  if (!dataHash[stockData.sym]) {
    Set(barCalculated);
  } else {
    const Stockdata = dataHash[stockData.sym];
    const latestStockdata = Stockdata[Stockdata.length - 1];
    if (latestStockdata.bar === barCalculated) {
      latestStockdata.c = 0.0;
      dataHash[stockData.sym].push({
        event: "ohlc_notify",
        symbol: stockData.sym,
        o: latestStockdata.o,
        bar: barCalculated,
        h: stockData.P > latestStockdata.h ? stockData.P : latestStockdata.h,
        l: stockData.P < latestStockdata.l ? stockData.P : latestStockdata.l,
        c: stockData.P,
        volume: Decimal.add(stockData.Q, latestStockdata.volume),
        timeStamp: Decimal.mul(stockData.TS2, 1000000000)
      });
    } else {
      Set(barCalculated, latestStockdata.volume);
    }
  }
}
