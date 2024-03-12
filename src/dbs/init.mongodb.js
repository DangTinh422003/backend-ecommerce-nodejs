const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // connect
  connect(type = "mongodb") {
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connect db successful!");
      })
      .catch((e) => {
        console.log(e);
        console.log("Connect db fail!");
      });
  }
}

const instanceMongodb = Database.getInstance();
module.export = instanceMongodb;
