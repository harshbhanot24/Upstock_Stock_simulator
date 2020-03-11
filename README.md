# Upstocks Stock Simulator

Upstocks Stock Simulator is a node JS based stock simulator which reads JSON data and returns the bar graph data in  OHLC (opening value, Highest value,lowest value and closing value) based upon a given time frame for a particular stock.

### Features
  - Bar graph based upon chartJS
  - Node worker threads
  - Socket.io based subscriptions

### Installation

Upstocks Stock Simulator requires [Node.js](https://nodejs.org/) v11+ to run.
Note: If you are using old nodeJs versions you may have to use --experimental-worker flag.

Install the dependencies and devDependencies and start the server.

```sh
$ cd Upstock_Stock_simulator
$ npm install 
$ node index.js
```



Verify the deployment by navigating to your server address in your preferred browser.

```sh
http://localhost:4200/
```
For any issue create a issue request.
