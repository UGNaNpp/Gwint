const { MongoClient, ObjectId } = require("mongodb");
const { isUserIdInDb } = require("./login");
const { allCards } = require("./Cards/allCards");
const config = require("./../config.json");
const { v4: uuidv4 } = require("uuid");
const connectionString = config.mongo.connection;


async function createGame(creatorId, opponentId= null) {
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

function generateGameJSObj(creatorId, opponentId = null) {
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
        actDeck: genPlayerCards(),
      },
      player2: {
        userId: opponentId,
        actDeck: genPlayerCards(),
      },
    },
    rounds:[],
    generationTime: new Date(),
    active: true
  };
}

module.exports = { createGame };
