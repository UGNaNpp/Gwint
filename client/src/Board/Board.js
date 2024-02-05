import React, { useState, useEffect } from 'react';
import allCards from '../Cards/allCards.js';
import CardDisplay from './CardDisplay.js';
import './Board.css';

const Board = () => {
  // karty przydzielone graczowi (karty w ręce)
  const [playerCards, setPlayerCards] = useState([]);

  // karty na planszy gracza
  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  // karty przydzielone przeciwnikowi
  const [opponentCards, setOpponentCards] = useState([]);

  // karty na planszy przeciwnika
  const [opponentCardsOnBoard, setOpponentCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  // aktualne punkty gracza
  const [score, setScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);

  // tasowanie (losowe sortowanie) talii i danie pierwszych 10 graczowi i potem ponowne losowanie i danie przeciwnikowi
  useEffect(() => {
    let playerDeck = [...allCards];
    playerDeck.sort(() => Math.random() - 0.5);
    setPlayerCards(playerDeck.slice(0, 10));

    let opponentDeck = [...allCards];
    opponentDeck.sort(() => Math.random() - 0.5);
    setOpponentCards(opponentDeck.slice(0, 10));
  }, []);

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

        setEnemyScore(prevScore => prevScore + botCard.power);

        setIsPlayerTurn(true); // gracz ma ruch
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
          <CardDisplay key={index} {...card} onClick={() => handleCardClick(card)} />
        ))}
      </div>
    </div>
  );
}

export default Board;
