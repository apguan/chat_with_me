const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
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

const roomDetails = {};

const peerServer = ExpressPeerServer(peer, options);
peerServer.on("connection", id => {
  console.log(`connection created by ${id}`);
});

peerServer.on("call", data => {});

peerServer.on("disconnect", id => {
  console.log(`${id} has disconnected from the server`);
});

app.use("/peerjs", peerServer);

io.on("connect", socket => {
  let room = socket.handshake["query"]["r_var"];

  if (!roomDetails[room]) {
    roomDetails[room] = {
      participants: []
    };
  }

  let details = roomDetails[room];

  socket.join(room, () => {
    console.log("new person joined the room");
    io.to(room).emit("sync", details.participants);
  });

  socket.on("new participant", data => {
    console.log("user: ", data.id, " joined the room");
    if (!details.participants.includes(data.id)) {
      details.participants.push(data.id);
    }

    io.to(room).emit("sync", details.participants);
  });

  socket.on("disconnect", person => {
    details.participants = details.participants
      .slice()
      .filter(pool => pool !== person.id);
    if (!details.participants.length) delete details;

    socket.leave(room);
    io.to(room).emit("sync", details.participants);
    console.log("user disconnected");
  });
});

//Listen
const port = process.env.PORT;
http.listen(port, () => {
  console.log(`connected to port ${port}`);
  console.log(`connected to port ${peerPort}`);
});
