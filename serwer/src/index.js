const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.text({ type: "text/*" }));
const PORT = 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Yup = require("yup");
const { MongoClient, ObjectId } = require("mongodb"); // ? do usunięcia przy stworzeniu osobnych plików dla kategorii zapytań.

const passwords = require("./../passwords.json")

// test
app.get("/test", async (req, res) => {
  try {
    const connectionString = `mongodb+srv://${passwords.mongo.username}:${passwords.mongo.password}@cluster0.0xx1rb1.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(connectionString);
    const collection = client.db("Gwint").collection("Users");
    const result = await collection.findOne({"test": "test surname"});
    res.send(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});







app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});