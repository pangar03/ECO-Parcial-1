const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/rea-time",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/player-app", express.static(path.join(__dirname, "player_app")));
app.use("/narrator-app", express.static(path.join(__dirname, "narrator_app")));

let players = [];

const roles = ["villager", "wolf", "villager", "wolf"];

const randomizeRoles = roles.sort(() => Math.random() - 0.5);
console.log("ROLES: ", randomizeRoles);

let currentRoleIndex = 0;

app.get("/users", (req, res) => {
  res.send(players);
});

app.post("/join-game", (req, res) => {
  const playersCounter = players.length;
    if (playersCounter < 4) {
        const { username } = req.body;
        const id = players.length;
        const role = randomizeRoles[currentRoleIndex];
        players.push({ id, username, role });
        currentRoleIndex++;
        res.send({ message: "201", id, playersCounter: playersCounter + 1, role });
    } else {
        res.send({ message: "No hay cupo" });
    }
});

app.post("/notificar-dia", (req, res) => {
  if(players.length !== 4){
    res.send({message: "There are not enough players"});
  } else {
    res.send({message: 'Notifying Day'})
    io.emit('notificar-dia', {message: 'It`s Day Time', players})
  }
});

app.post("/notificar-noche", (req, res) => {
  if(players.length !== 4){
    res.send({message: "There are not enough players"});
  } else {
    res.send({message: 'Notifying Night'})
    io.emit('notificar-noche', {message: 'It`s Night Time', players})
  }
});

httpServer.listen(5050);