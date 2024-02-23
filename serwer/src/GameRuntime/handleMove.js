const { MongoClient, ObjectId } = require("mongodb");
const easyBot = require("./easyBot");
const config = require("./../../config.json");
const connectionString = config.mongo.connection;

//TODO logika końca rozgrywki
// TODO gra po passie gracza

async function handleMove(moveData, clearRun=false) {
  console.log(moveData, `Czy to clearRun?: ${clearRun}`)
  const gameId = moveData.gameId;
  const gameData = await getGameData(gameId);
  // TODO drzewo jeśli otrzymaliśmy ruch od player2

  if (clearRun == false) {
    console.log(moveData)
    if (moveData.cardData === null) {
      await handlePass(gameId, "player1");
    } else {
      if (!checkMovePossibilitty(gameData, moveData)) {
        throw new Error("Move is impossible");
      }
      await insertMoveIntoDb(moveData, "player1");
    }
  }

    switch (gameData.players.player2.actPassed) {
      case true:
        return null;
      case false:
        switch (gameData.players.player2.userId) {
          case "bot1": {
            const usedByBot = await easyBot.makeMove(
              gameData.players.player2.actDeck
            );
            if (usedByBot === null) {
              await handlePass(gameId, "player2");
              return await getPublicGameData(gameId);
            } else {
              const botMoveData = {
                gameId: moveData.gameId,
                cardData: usedByBot,
                userId: "bot1",
              };
              insertMoveIntoDb(botMoveData, "player2");
              
              if (gameData.players.player1.actPassed) {
                handleMove(moveData); // możemy użyć niezmienionego ruchu bo i tak musiał być on passem
              } else {
                return await getPublicGameData(gameId);
              }
            }
            }
          default: {
            // TODO gra player-player
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
  if (gameData.length == 0) {
    throw new Error("No active game with this id");
  } else {
    return gameData[0];
  }
}

// Do refaktoryzacji - nie chcemy wysyłać pełnych info o grze
async function getPublicGameData(gameId) {
  let dataToSend = await getGameData(gameId);
  // delete dataToSend.player1.actDeck;
  // delete dataToSend.player2.actDeck;
  return dataToSend;
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
  return queryRes.updatedCount === 1 ? true : false;
}

//TODO Na ogół to poniżej nie działą XD
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
    await collection.updateOne(
      {
        gameId: gameId,
        active: true,
      },
      {
        $set: { [`players.${playerNumber}.actPassed`]: true },
      }
    );
  }

  const client = new MongoClient(connectionString);
  const collection = client.db("Gwint").collection("Games");
  let actPassed = await collection
    .aggregate([
      {
        $match: { gameId: gameId, active: true },
      },
      {
        $project: {
          _id: 0,
          player1: "$players.player1.actPassed",
          player2: "$players.player2.actPassed",
        },
      },
    ])
    .toArray();
    actPassed = actPassed[0];

  // console.log(actPassed[playerNumber]);
  switch (actPassed[playerNumber]) {
    // ! Testowo można spasować nawet jak się wcześniej spasowało
    // case true:                   
    //   throw new Error("Player have passed before, so it is impossible now");
    default:
      switch (actPassed[oppositePlayer(playerNumber)]) {
        case true:
        //TODO obaj gracze spassowali
        break;
        default:
          updatePassInDB();
      }
  }

  // await client.close();
}

module.exports = { handleMove };
