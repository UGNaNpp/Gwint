const { MongoClient, ObjectId } = require("mongodb");
const config = require("./../../config.json");

async function basicHandleMove(moveData) {

}

// Rozdziela co dalej w zależności czy gramy z botem (i jakim) czy graczem
async function isOpponentBot (gameData, moveData) {
 switch (gameData.players.player2.userId) {
  case "bot1" : {
    
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
    { $match: { gameId: gameId, active: false } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        generationTime: 0,
        active: 0,
      },
    },
  ]);
  await client.close()
  if (gameData !== null) {
    throw new Error("No active game with this id");
  } else {
    return gameData
  }
}

module.exports = { basicHandleMove };
