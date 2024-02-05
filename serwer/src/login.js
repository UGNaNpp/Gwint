const { MongoClient, ObjectId } = require("mongodb");
const passwords = require("../passwords.json");
const bcrypt = require("bcrypt");
const Yup = require("yup");


const connectionString = `mongodb+srv://${passwords.mongo.username}:${passwords.mongo.password}@cluster0.0xx1rb1.mongodb.net/?retryWrites=true&w=majority`;

async function register(registerData) {
  const validationRes = await validateRegister(registerData);
  if (!validationRes.status) {
    throw new Error(validateRegister.err);
  }

  if (await isEmaiInDb(registerData.email)) {
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

async function logIn(logInData) {
  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Users");
  const queryRes = await collection.findOne({ email: logInData.email });
  await client.close()
  if (queryRes !== null) {
    const isPasswordCorrect = await comparePasswordWithHash(
      logInData.password,
      queryRes.passwordHash
    );
    if (isPasswordCorrect) {
      return queryRes._id.valueOf();
    } else {
      throw new Error("Incorrect password");
    }
  } else {
    throw new Error("Email doesn't exist");
  }
}

function hashPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 10, function (err, hash) {
      if (err) {
        console.error("Error while hashing ", err);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

//boolean
function comparePasswordWithHash(password, hashPassword) {
  return new Promise(
    (resolve, reject) => {
      bcrypt.compare(password, hashPassword, (err, result) => {
        if (err) {
          reject(false);
        } else {
          resolve(result)
        }
      });
    })
    
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


  async function isUserIdInDb (userId) {
    const client = new MongoClient(connectionString);
    const collection = client.db("Gwint").collection("Users");
    const queryRes = await collection.findOne({_id: new ObjectId(userId)});
  if (queryRes !== null) {
    return true;
  } else {
    return false;
  }
  }
  
function validateRegister(registerData) {
  return new Promise((resolve, reject) => {
    Yup.object({
      name: Yup.string()
        .min(1, "Must be at least 1 character")
        .max(60, "Must be max 60 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Incorrect email")
        .min(1, "Must be at least 1 character")
        .max(60, "Must be max 60 characters")
        .required("Required"),
      password: Yup.string()
        .min(5, "Must be at least 5 characters")
        .max(
          100,
          "Seriously, do You want to remember more than 100 characters?"
        )
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol")
        .required("Required"),
    })
      .validate(registerData)
      .then(() => {
        resolve({
          status: true,
        });
      })
      .catch((err) =>
        reject({
          status: false,
          error: err.message,
        })
      );
  });
}


module.exports = { register, logIn, isUserIdInDb };
