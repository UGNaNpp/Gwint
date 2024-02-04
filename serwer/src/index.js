const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const Yup = require("yup");
const { MongoClient, ObjectId } = require("mongodb");
const passwords = require("./../passwords.json");
const register = require("./login").register;

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
          console.error(err);
          res.status(500).send("Error Occured.");
          break;
        }
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
