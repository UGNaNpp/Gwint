const { MongoClient, ObjectId } = require("mongodb");
const { isUserIdInDb } = require("./login");
const { allCards } = require("./Cards/allCards");
const passwords = require("../passwords.json");
const { v4: uuidv4 } = require("uuid");
const connectionString = `mongodb+srv://${passwords.mongo.username}:${passwords.mongo.password}@cluster0.0xx1rb1.mongodb.net/?retryWrites=true&w=majority`;

async function createGame(creatorId) {
  if (await isUserIdInDb(creatorId)) {
    const client = new MongoClient(connectionString);
    const collection = client.db("Gwint").collection("Games");
    const gameJSObj = generateGameJSObj(creatorId);
    const queryRes = await collection.insertOne(gameJSObj);
    await client.close();
    const gameId = queryRes.insertedId;
    const response = {
      gameId: gameId,
      playerDeck: gameJSObj.players.player1.startDeck,
    };
    return response;
  } else {
    throw new Error("No creatorId in db");
  }
}

function generateGameJSObj(creatorId) {
  function genPlayerCards() {
    let playerDeck = [...allCards];
    playerDeck.sort(() => Math.random() - 0.5);
    return playerDeck.slice(0, 10).map((card) => card.toJSObj());
  }

  return {
    gameId: uuidv4(),
    players: {
      player1: {
        userId: creatorId,
        startDeck: genPlayerCards(),
      },
      player2: {
        userId: null,
        startDeck: genPlayerCards(),
      },
    },
    generationTime: new Date(),
  };
}

module.exports = { createGame };
