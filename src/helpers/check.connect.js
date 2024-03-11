const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

// count connect db
function countConnect() {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection:: ${numConnection}`);
}

function checkOverload() {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Maximum number of connections based on number osf cores
    const maxConnections = numCores * 5; // 5 request per 1 core

    console.log(`Active connection: ${numConnection} `);
    console.log(`Memory usage : ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, _SECOND); // monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload,
};
