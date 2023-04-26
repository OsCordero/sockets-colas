require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { socketController } = require("../../sockets");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);

    // this.dbConnect();

    this.middlewares();
    this.routes();
    this.sockets();
  }

  routes() {
    // this.app.use("/api/auth", require("../routes/auth"));
  }

  sockets() {
    this.io.on("connection", socketController);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.static("public"));

    // this.app.use(express.json());
  }

  //   async dbConnect() {
  //     await require("../db/config").dbConnection();
  //   }

  listen() {
    this.server.listen(this.port || 3000, () => {
      console.log(`Socket server started on port ${this.port}`);
    });
  }
}

module.exports = Server;
