const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");

const app = express();
const port = process.env.PORT;

http.createServer(app);

app.use(express.static(path.join(__dirname, "/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let rooms = {};

app.get("/", (req, res) => {
  res.send(null, 200);
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if (!rooms[roomId]) {
    room[roomId] = {
      participants: []
    };
  }
});

http.listen(port, () => {
  console.log(`connected to port ${port}`);
});
