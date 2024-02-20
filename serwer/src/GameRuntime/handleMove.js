const { MongoClient, ObjectId } = require("mongodb");
const easyBot = require("./easyBot");
const config = require("./../../config.json");
const connectionString = config.mongo.connection;

//TODO logika końca rozgrywki
// TODO gra po passie gracza
// Rozdziela co dalej w zależności czy gramy z botem (i jakim) czy graczem
async function handleMove(moveData) {
  const gameData = await getGameData(moveData.gameId);
  // TODO drzewo jeśli otrzymaliśmy ruch od player2

  if (moveData.cardData === null) {
    handlePass(moveData.gameId, "player1");
  } else {
    if (!checkMovePossibilitty(gameData, moveData)) {
      throw new Error("Move is impossible");
    }
    insertMoveIntoDb(moveData, "player1");

    switch (gameData.players.player2.actPassed) {
      case true:
        return null;
      case false: 
        
      switch (gameData.players.player2.userId) {
        case "bot1": {
          const usedByBot = await easyBot.usedCard(
          gameData.players.player2.actDeck
        );
        const botMoveData = {
          gameId: moveData.gameId,
          cardData: usedByBot,
          userId: "bot1",
        };
        console.log(botMoveData);
        insertMoveIntoDb(botMoveData, "player2");

        if (gameData.players.player1.actPassed) {
          handleMove(moveData) // możemy użyć niezmienionego ruchu bo i tak musiał być on passem
        } else {
          return await getPublicGameData(gameId);
        }
        
      }
      default: {
        // TODO gra player-player
      }
    }
  }
  }
}

async function getGameData(gameId) {
  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Games");
  const gameData = await collection
    .aggregate([
      { $match: { gameId: gameId, active: true } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          generationTime: 0,
          active: 0,
        },
      },
    ])
    .toArray();
  await client.close();
  // console.dir(gameData, {depth: null});
  if (gameData.length == 0) {
    throw new Error("No active game with this id");
  } else {
    return gameData[0];
  }
}

async function getPublicGameData(gameId) {
  let dataToSend = await getGameData(gameId);
  delete dataToSend.player1.actDeck
  delete dataToSend.player2.actDeck
  return dataToSend
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
  //? nie mam pewności jak to się nazywa w linii niżej
  return queryRes.updatedCount === 1 ? true : false;
}

//TODO validacja czy mamy kartę której chcemy użyć
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

// także jeśli skończyły się komuś karty
async function handlePass(gameId, playerNumber) {
  function oppositePlayer(playerNumber) {
    return playerNumber == "player1" ? "player2" : "player1";
  }

  async function updatePassInDB() {
    await client.updateOne(
      {
        gameId: gameId,
        active: true,
      },
      {
        $set: { [`players.${oppositePlayer(playerNumber)}.actPassed`]: true },
      }
    );
  }

  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Games");
  const passInfo = await collection
    .aggregate([
      {
        $match: { gameId: gameId, active: true },
      },
      {
        $project: {
          _id: 0,
          "player1.actPassed": 1,
          "player2.actPassed": 1,
        },
      },
    ])
    .toArray()
    .next();
  console.log(passInfo);

  console.log([`passInfo.${playerNumber}.passInfo`]);
  switch ([`passInfo.${playerNumber}.passInfo`]) {
    case true:
      throw new Error("Player have passed before, so it is impossible now");
    default:
      switch ([`passInfo.${oppositePlayer(playerNumber)}.passInfo`]) {
        case true:
        //TODO obaj gracze spassowali
        default:
          updatePassInDB();
      }
  }

  await client.close();
}

module.exports = { handleMove };
