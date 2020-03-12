const LineByLineReader = require("line-by-line"),
const { parentPort, workerData, isMainThread } = require("worker_threads");
  lr = new LineByLineReader("trades.json");
if (!isMainThread) {
  {
    let count = 0;
    lr.on("error", function(err) {
      console.log("There is an error in reading line",err)
    });  
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
      // Uncomment these line to simulate realTime data
      count++;
    });

    lr.on("end", function() {
      console.log("no of line read", count);
      parentPort.postMessage("Data Read Done");
      // All lines are read, file is closed now.
    });
  }
}
