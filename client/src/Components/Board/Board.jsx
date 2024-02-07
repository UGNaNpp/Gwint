import React, { useState, useEffect } from "react";
import CardDisplay from "./CardDisplay.js";
import "./Board.css";
import axios from "axios";
import Card from "./../Cards/Card.js";
const config = require("./../../Resources/config.json");

//TODO Co po wyczerpaniu kart? Front i backend
//TODO Backend obsługuje nie pojedyńcze rundy a całe gry, po kilka rund jako jeden dokument mając i wygranych cząstkowych i finalnych.

const Board = () => {
  const [userID, setUserId] = useState("")

  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);

  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  const [opponentCardsOnBoard, setOpponentCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  
  
  useEffect(() => {
    startGame();
  }, []);
  
  
  function startGame() {
    function resetBoard () {
      setPlayerCardsOnBoard({
        melee: [],
      ranged: [],
      ballista: [],
      });
      setOpponentCardsOnBoard({
        melee: [],
      ranged: [],
      ballista: [],
      });
    };

    const getCookie = (name) => {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(cookie => cookie.trim().startsWith(name + '='));
      return cookie ? cookie.split('=')[1] : null;
    };

    setUserId(getCookie("userID"))
    resetBoard();
    axios
      .post(`${config.serverURL}/new-game`, { creatorId: userID })
      .then((response) => {
        console.log(response);
        setPlayerCards(
          response.data.playerDeck.map((card) => Card.createFromJSObject(card))
        );
        setOpponentCards(
          response.data.opponentDeck.map((card) =>
            Card.createFromJSObject(card)
          )
        ); //! tylko developersko
      })
      .catch((err) => console.error(err));
  }


  const [score, setScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);

  const [playerPassed, setPlayerPassed] = useState(false);
  const [opponentPassed, setOpponentPassed] = useState(false);
  const [playerCrystals, setPlayerCrystals] = useState(2);
  const [opponentCrystals, setOpponentCrystals] = useState(2);
  
  useEffect(() => {
    console.log(playerPassed);
  }, [playerPassed]);

  const [botMoves, setBotMoves] = useState(0);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const handleCardClick = (card) => {
    if (!isPlayerTurn || playerPassed) {
      return; 
    }

    // po kliknieciu
    setPlayerCards(playerCards.filter((c) => c !== card)); //usuwa karte z reki gracza
    setPlayerCardsOnBoard((prevState) => {
      //dodaje na plansze
      const updatedState = {
        ...prevState,
        [card.cardClass]: [...prevState[card.cardClass], card],
      };
      return updatedState;
    });
    setScore((prevScore) => prevScore + card.power); //dodaje punkty. (później punkty powinny być liczone dla każdego rzędu z osobna)

    if (!opponentPassed) {
      setIsPlayerTurn(false);
      botMove();
    }
  };

  if (playerPassed && opponentPassed) {
    if (score > enemyScore) {
      setOpponentCrystals((prevCrystals) => prevCrystals - 1);
    } else if (score < enemyScore) {
      setPlayerCrystals((prevCrystals) => prevCrystals - 1);
    }

    setPlayerPassed(false);
    setOpponentPassed(false);
    setScore(0);
    setEnemyScore(0);
    setBotMoves(0);
  }

  const handlePassClick = () => {
    //pasujemy
    if (isPlayerTurn && !playerPassed) {
      setPlayerPassed(true);
      setIsPlayerTurn(false);

      botMove(true);
    }
  };

  useEffect(() => {
    console.log(playerPassed);
  }, [playerPassed]);

  const botMove = (playerHasPassed) => {
    setTimeout(() => {
      if (opponentCards.length > 0 && !opponentPassed) {
        const passChance = botMoves * 0.0; // szansa na spasowanie bota rośnie z każdym ruchem
        const e = Math.random();
        // console.log(e, "musi byc mniejsze od ", passChance)
        if (e < passChance) {
          console.log("chlop spasował");
          setOpponentPassed(true);
          setIsPlayerTurn(true);
        } else {
          const botCardIndex = Math.floor(Math.random() * opponentCards.length);
          const botCard = opponentCards[botCardIndex];
          setBotMoves((prevMoves) => prevMoves + 1);

          setOpponentCards(
            opponentCards.filter((c, index) => index !== botCardIndex)
          );
          setOpponentCardsOnBoard((prevState) => {
            const updatedState = {
              ...prevState,
              [botCard.cardClass]: [...prevState[botCard.cardClass], botCard],
            };
            return updatedState;
          });

          setEnemyScore((prevScore) => prevScore + botCard.power);
          // console.log("czy ja spasowalem?", playerHasPassed)

          if (!playerHasPassed) {
            setIsPlayerTurn(true);
          } else {
            botMove(playerHasPassed);
          }
        }
      }
    }, 1000);
  };

  return (
    <div className="game">
      <div className="scores">
        <div className="score">
          Twój wynik: {score}
          <div className="cristal"></div>
          <div className="cristal"></div>
          <button onClick={handlePassClick}>Spasuj</button>
        </div>
        <div className="score">
          Wynik przeciwnika: {enemyScore}
          <div className="cristal"></div>
          <div className="cristal"></div>
        </div>
      </div>

      <div className="opponent-cards">
        {opponentCards.map((card, index) => (
          <CardDisplay key={index} {...card} />
        ))}
      </div>
      <div className="board">
        <div className="row opponent-row ballista">
          {opponentCardsOnBoard.ballista.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
        <div className="row opponent-row ranged">
          {opponentCardsOnBoard.ranged.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
        <div className="row opponent-row melee">
          {opponentCardsOnBoard.melee.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>

        <div className="row player-row melee">
          {playerCardsOnBoard.melee.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
        <div className="row player-row ranged">
          {playerCardsOnBoard.ranged.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
        <div className="row player-row ballista">
          {playerCardsOnBoard.ballista.map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
        </div>
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
