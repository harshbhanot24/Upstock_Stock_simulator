var LineByLineReader = require("line-by-line"),
  lr = new LineByLineReader("trades.json");
const { parentPort, workerData, isMainThread } = require("worker_threads");

if (!isMainThread) {
  {
    lr.on("error", function(err) {
      // 'err' contains error object
    });
    let count = 0;
    // let firstline = true;
    // let ts1;
    // let ts2;
    lr.on("line", function(line) {
      // if (count === 0) {
      //   ts1 = JSON.parse(line).TS2;
      //   firstline = false;
      // } else {
      //   ts2 = JSON.parse(line).TS2;
      // }
      // Uncomment these line to simulate realTime data
      parentPort.postMessage(JSON.parse(line));
      // if (count > 0) {
      //   lr.pause();
      //   setTimeout(function() {
      //     lr.resume();
      //     ts1 = ts2;
      //   }, (ts2 - ts1) / 10000000);
      // }
      count++;
    });

    lr.on("end", function() {
      console.log("no of line read", count);
      // All lines are read, file is closed now.
    });
  }
}
