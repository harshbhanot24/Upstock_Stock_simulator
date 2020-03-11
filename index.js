const express = require("express");
const app = express();
const port = 4200;
const server = require("http").createServer(app);
var io = require("socket.io").listen(server);
const _ = require("lodash");
const {
  Worker,
  MessageChannel,
  MessagePort,
  isMainThread,
  parentPort
} = require("worker_threads");
const path = require("path");

app.use(express.static(__dirname + "/node_modules"));
app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/index.html");
});
let flag = false;
function compute() {
  if (isMainThread) {
    const workerScript = path.join(__dirname, "./readFile.js");
    const FSMScript = path.join(__dirname, "./FSM.js");
    const FileReader = new Worker(workerScript);
    const FSM = new Worker(FSMScript);
    //pass data coming from read file worker
    FileReader.on("message", data => {
      FSM.postMessage(data);
    });

    FileReader.on("error", error => console.error("error", error));
    FileReader.on("exit", () => (flag = true));

    io.sockets.on("connection", function(socket) {
      socket.on("sendStock", function(stockName) {
        if (flag) {
          FSM.postMessage(stockName);
          FSM.on("message", data => {
            const Parseddata = JSON.parse(data);
            let index = 0;
            let bars = _.map(Parseddata, stock => {
              return stock.bar;
            });
            bars = _.uniq(bars);
            const interval = setInterval(() => {
              const data = _.filter(
                Parseddata,
                stock => stock.bar === bars[index]
              );
              socket.emit("data", data);
              index++;
            }, 5000);
            if (index === data.length) {
              clearInterval(interval);
            }
          });
        }
      });
    });
  }
}

server.listen(4200, () => compute());
