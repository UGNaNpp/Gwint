import React, { useState, useEffect } from 'react';
import CardDisplay from './CardDisplay.js';
import './Board.css';
import axios from 'axios';
import Card from "./../Cards/Card.js"
const config = require("./../../Resources/config.json");
const developUserId = "f8d13d62-0124-4c07-901d-507e6ba45b59"; //TODO zrób to z ciasteczka
// ! Jeśli ja kiedyś zostawię tyle komentarzy w kodzie błagam przyjdzcie i mnie ubijcie.
// ! Jak na moje oko ten kod jest świetnie samokomentujący więc to nie jest potrzebne.

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);


  // karty na planszy gracza
  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });


  // karty na planszy przeciwnika
  const [opponentCardsOnBoard, setOpponentCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  // aktualne punkty gracza
  const [score, setScore] = useState(0);
  startGame()
  useEffect(() => {

  }, []);

  function startGame() {
    axios
    .post(`${config.serverURL}/new-game`, {creatorId: developUserId})
    .then((response) => {
      console.log(response)
    setPlayerCards(response.data.playerDeck.map((card) => Card.createFromJSObject(card)))
    setOpponentCards(response.data.opponentDeck.map((card) => Card.createFromJSObject(card))) //! tylko developersko
    })
    .catch(err => console.error(err))
  }

  // czy gracz ma teraz ruch
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  //  kliknięcie w kartę
  const handleCardClick = (card) => {
    if (!isPlayerTurn) {
      return; // jak nie masz ruchu to nie klikniesz
    }

    // po kliknieciu
    setPlayerCards(playerCards.filter(c => c !== card)); //usuwa karte z reki gracza
    setPlayerCardsOnBoard(prevState => { //dodaje na plansze
      const updatedState = {
        ...prevState,
        [card.cardClass]: [...prevState[card.cardClass], card]
      };
      return updatedState;
    });
    setScore(prevScore => prevScore + card.power); //dodaje punkty. (później punkty powinny być liczone dla każdego rzędu z osobna)

    setIsPlayerTurn(false); // przeciwnik ma ruch

    // bot po sekundzie wybiera losową kartę
    setTimeout(() => {
      if (opponentCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponentCards.length);
        const botCard = opponentCards[randomIndex];

        setOpponentCards(opponentCards.filter(c => c !== botCard));
        setOpponentCardsOnBoard(prevState => {
          const updatedState = {
            ...prevState,
            [botCard.cardClass]: [...prevState[botCard.cardClass], botCard]
          };
          return updatedState;
        });

        setIsPlayerTurn(true); // gracz ma ruch
      }
    }, 1000);
  };

  return (
    <div className="game">
      <div className="score">Score: {score}</div>
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
          <CardDisplay key={index} {...card} onClick={() => handleCardClick(card)} />
        ))}
      </div>
    </div>
  );
}

export default Board;
