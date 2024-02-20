const { MongoClient, ObjectId } = require("mongodb");
const easyBot = require("./easyBot");
const config = require("./../../config.json");
const connectionString = config.mongo.connection;

// TODO gra po passie gracza
// Rozdziela co dalej w zależności czy gramy z botem (i jakim) czy graczem
async function handleMove(moveData) {
  const gameData = await getGameData(moveData.gameId);
  // TODO drzewo jeśli otrzymaliśmy ruch od player2
  if (!checkMovePossibilitty(gameData, moveData)) {
    throw new Error("Move is impossible");
  }
  insertMoveIntoDb(moveData, "player1");

  console.dir(gameData, {depth: null});
  console.log(gameData.players.player2.userId);
  switch (gameData.players.player2.userId) {
    case "bot1": {
      console.log("Ogarnąłem że to gra bot")
      const usedByBot = easyBot.usedCard(gameData.players.player2.actDeck);
      const botMoveData = {
        gameId: moveData.gameId,
        cardData: usedByBot,
        userId: "bot1",
      };
      insertMoveIntoDb(botMoveData, "player2");
      return botMoveData;
    }
    default: {
      // TODO gra player-player
    }
  }
}

async function getGameData(gameId) {
  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Games");
  const gameData = await collection.aggregate([
    { $match: { gameId: gameId, active: true } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        generationTime: 0,
        active: 0,
      },
    },
  ]).toArray();
  await client.close();
  // console.dir(gameData, {depth: null});
  if (gameData == null) {
    throw new Error("No active game with this id");
  } else {
    return gameData[0];
  }
}

//TODO dodanie czasu wykonania ruchu do historii i restrukturyzacja nazwy
async function insertMoveIntoDb(moveData, playerNumber) {
  // playerNumber to player1 lub player2
  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Games");
  const queryRes = await collection.updateOne(
    { gameId: moveData.gameId },
    {
      $push: { [`players.${playerNumber}.history`]: moveData.cardData },
      $pull: { [`players.${playerNumber}.actDeck`]: moveData.cardData },
    }
  );
  //! nie mam pewności jak to się nazywa w linii niżej
  return queryRes.updatedCount === 1 ? true : false;
}

//boolean
async function checkMovePossibilitty(gameData, moveData) {
  if (moveData.userId == gameData.players.player1.userId) {
    return moveData.cardData in gameData.players.player1.actDeck ? true : false;
  } else if (moveData.userId == gameData.players.player2.userId) {
    return moveData.cardData in gameData.players.player2.actDeck ? true : false;
  } else {
    throw new Error("User doesn't take part this in game");
  }
}


module.exports = { handleMove };
