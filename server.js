const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const ExpressPeerServer = require("peer").ExpressPeerServer;

app.use(express.static(path.join(__dirname, "/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Home
app.get("/", (req, res) => {
  res.send(null, 200);
});

//Peer.js server
const peerPort = process.env.PEER_PORT;
const peer = app.listen(peerPort);
const options = {
  debug: true
};

const peerServer = ExpressPeerServer(peer, options);
app.get("/room/:roomId", peerServer);

//Listen
const port = process.env.PORT;
http.listen(port, () => {
  console.log(`connected to port ${port}`);
  console.log(`connected to port ${peerPort}`);
});
