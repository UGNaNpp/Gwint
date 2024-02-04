const { MongoClient, ObjectId } = require("mongodb");
const passwords = require("../passwords.json");
const bcrypt = require("bcrypt");

const connectionString = `mongodb+srv://${passwords.mongo.username}:${passwords.mongo.password}@cluster0.0xx1rb1.mongodb.net/?retryWrites=true&w=majority`;

// TODO validacja
function register(registerData) {
  try {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(connectionString);
      hashPassword(registerData.password).then(
        (passwordHash) => {
          delete registerData.password;
          const collection = client.db("Gwint").collection("Users");
          const result = collection
            .insertOne({
              ...registerData,
              points: 0,
              passwordHash: passwordHash,
            })
            .then(() => {
              resolve(result);
            });
        }
      );
    });
  } catch (error) {
    return error;
  }
}

function hashPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 10, function (err, hash) {
      if (err) {
        console.error("Error while hashing ", err);
        reject("Problems occurent during hashing password");
      } else {
        resolve(hash);
      }
    });
  });
}

module.exports = { register };
