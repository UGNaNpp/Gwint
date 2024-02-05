const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { logIn, register } = require("./login");
const {createGame} = require("./createGame");

app.use(express.text({ type: "text/*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8080;

app.post("/register", (req, res) => {
  const registerData = req.body;
  register(registerData)
    .then((result) => res.send(result))
    .catch((err) => {
      switch (err.message) {
        case "Email exists.":
          res.status(409).send(err.message);
          break;
        default: {
          res.status(500).send(err);
          break;
        }
      }
    });
});

// wymaga email i password
app.post("/login", (req, res) => {
  const logInData = req.body;
  logIn(logInData)
    .then((result) => res.status(202).send(result))
    .catch((err) => {
      res.status(401).send(err.message);
    });
});

// wymaga creatorId
app.post("/new-game", (req, res) => {
  const creatorId = req.body.creatorId;
  createGame(creatorId)
  .then(result => res.status(201).send(result))
  .catch(err => {
      console.error(err);
      res.status(400).send(err.message)
    })
})

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
