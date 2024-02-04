const { MongoClient, ObjectId } = require("mongodb");
const passwords = require("../passwords.json");
const bcrypt = require("bcrypt");
const { query } = require("express");

const connectionString = `mongodb+srv://${passwords.mongo.username}:${passwords.mongo.password}@cluster0.0xx1rb1.mongodb.net/?retryWrites=true&w=majority`;

// TODO validacja
async function register(registerData) {
  if ( await isEmaiInDb(registerData.email)) {
    throw new Error("Email exists.");
  } else {
    const client = new MongoClient(connectionString);
    const passwordHash = await hashPassword(registerData.password);
    const collection = client.db("Gwint").collection("Users");
    delete registerData.password;
    const queryRes = await collection.insertOne({
      ...registerData,
      points: 0,
      passwordHash: passwordHash,
    });
    await client.close();
    const userId = queryRes.insertedId;
    return userId;
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

async function isEmaiInDb(email) {
  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Users");
  const queryRes = await collection.findOne({
    email: email,
  });
  await client.close();
  if (queryRes === null) return false;
  else return true;
}

module.exports = { register };
