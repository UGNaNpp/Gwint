import React, { useState, useEffect } from "react";
import CardDisplay from "./CardDisplay.js";
import "./Board.css";
import axios from "axios";
import Card from "./../Cards/Card.js";
import BoardRow from "./BoardRow.jsx";
const config = require("./../../Resources/config.json");
const developUserId = "f8d13d62-0124-4c07-901d-507e6ba45b59"; //TODO userId z ciasteczka stworzonego podczas logowania

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);
  const [gameId, setGameId] = useState("Not known");

  function moveDataToSend(cardData = null) {
    return {
      gameId: gameId,
      userId: developUserId,
      cardData: cardData,
    };
  }

  const emptyHalfBoard = {
    melee: [],
    ranged: [],
    ballista: [],
  };

  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState(emptyHalfBoard);

  const [opponentCardsOnBoard, setOpponentCardsOnBoard] =
    useState(emptyHalfBoard);

  function groupCardsOnBoard(cards, actBoard = emptyHalfBoard) {
    switch (cards.length) {
      case 0:
        return actBoard;
      default:
        const firstElement = cards.shift();
        switch (firstElement.cardClass) {
          case "melee":
            return groupCardsOnBoard(cards, {
              ...actBoard,
              melee: [...actBoard.melee, firstElement],
            });
          case "ranged":
            return groupCardsOnBoard(cards, {
              ...actBoard,
              ranged: [...actBoard.ranged, firstElement],
            });
          case "ballista":
            return groupCardsOnBoard(cards, {
              ...actBoard,
              ballista: [...actBoard.ballista, firstElement],
            });
          default:
            throw new Error("Incorrect card class");
        }
    }
  }

  function startGame() {
    const resetBoard = () => {
      setPlayerCardsOnBoard(emptyHalfBoard);
      setOpponentCardsOnBoard(emptyHalfBoard);
    };

    resetBoard();
    axios
      .post(`${config.serverURL}/new-game`, { creatorId: developUserId })
      .then((response) => {
        console.log("Utworzono nową grę");
        setGameId(response.data.gameId);
        setPlayerCards(
          response.data.playerDeck.map((card) => Card.createFromJSObject(card))
        );
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    startGame();
  }, []);

  async function sendMoveData(cardData=null) {
    console.log(moveDataToSend(cardData))
    axios
      .post(`${config.serverURL}/move`, moveDataToSend(cardData))
      .then((response) => {
        console.log(response);
        // console.log(response.body.players.player2);
        setOpponentCardsOnBoard(groupCardsOnBoard(response.data.players.player2.history)); // format danych się zmieni
      })
      .catch((err) => console.error(err));
  }

  const handleCardClick = (card) => {
    function actualiseBoard(card) {
      setPlayerCardsOnBoard((prevState) => {
        const updatedState = {
          ...prevState,
          [card.cardClass]: [...prevState[card.cardClass], card],
        };
        return updatedState;
      });
    }
    sendMoveData(card)
    setPlayerCards(playerCards.filter(c => c !== card));
    actualiseBoard(card);
    // todo validacja czy rozpocząteo grę (mamy gameId) przed ruchem
  };

  const handlePassClick = () => {
    sendMoveData(null)
  };

  return (
    <div className="game">
      <p>Id gry: {gameId}</p>
      <div className="scores">
        <div className="score">
          Twój wynik: Score
          <div className="cristal"></div>
          <div className="cristal"></div>
          <button onClick={handlePassClick}>Spasuj</button>
        </div>
        <div className="score">
          Wynik przeciwnika: Score przecinika
          <div className="cristal"></div>
          <div className="cristal"></div>
        </div>
      </div>
      <div className="board">
        <BoardRow cardType="ballista" cardsOnBoard={opponentCardsOnBoard} whose="opponent-row"/>
        <BoardRow cardType="ranged" cardsOnBoard={opponentCardsOnBoard} whose="opponent-row"/>
        <BoardRow cardType="melee" cardsOnBoard={opponentCardsOnBoard} whose="opponent-row"/>
        
        <BoardRow cardType="melee" cardsOnBoard={playerCardsOnBoard} whose="player-row"/>
        <BoardRow cardType="ranged" cardsOnBoard={playerCardsOnBoard} whose="player-row"/>
        <BoardRow cardType="ballista" cardsOnBoard={playerCardsOnBoard} whose="player-row"/>


      </div>
      <div className="cards">
        {playerCards.map((card, index) => (
          <CardDisplay
            key={index}
            {...card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
