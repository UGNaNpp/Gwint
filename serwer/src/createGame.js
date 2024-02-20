const { MongoClient, ObjectId } = require("mongodb");
const { isUserIdInDb } = require("./login");
const { allCards } = require("./Cards/allCards");
const { v4: uuidv4 } = require("uuid");
const config = require("./../config.json");
const connectionString = config.mongo.connection;


async function createGame(creatorId, opponentId= null) {
  if (await isUserIdInDb(creatorId)) {
    const client = new MongoClient(connectionString);
    const collection = client.db("Gwint").collection("Games");
    const gameJSObj = generateGameJSObj(creatorId);
    const queryRes = await collection.insertOne(gameJSObj);
    await client.close();
    const gameId = gameJSObj.gameId;
    const response = {
      gameId: gameId,
      playerDeck: gameJSObj.players.player1.actDeck,
    };
    console.log(response);
    return response;
  } else {
    throw new Error("No creatorId in db");
  }
}

// TODO SERVER MUSI USTAWIAĆ PRZY TWORZENIU ID OPPONENTA dla bezpieczeństwa
function generateGameJSObj(creatorId, opponentId = "bot1") { //! domyślne utworzenie gry z botem nie może zostać
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
        actPassed: false,
        history:[]
      },
      player2: {
        history:[],
        actPassed: false,
        userId: opponentId,
        actDeck: genPlayerCards(),
      },
    },
    generationTime: new Date(),
    active: true
  };
}



module.exports = { createGame};
