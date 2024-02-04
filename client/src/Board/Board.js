import React, { useState, useEffect } from 'react';
import allCards from '../Cards/allCards.js';
import CardDisplay from './CardDisplay.js';
import './Board.css';

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);
  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });
  const [opponentCards, setOpponentCards] = useState([]);
  const [opponentCardsOnBoard, setOpponentCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });
  const [score, setScore] = useState(0);

  useEffect(() => {
    let playerDeck = [...allCards];
    playerDeck.sort(() => Math.random() - 0.5);
    setPlayerCards(playerDeck.slice(0, 10));

    let opponentDeck = [...allCards];
    opponentDeck.sort(() => Math.random() - 0.5);
    setOpponentCards(opponentDeck.slice(0, 10));
  }, []);


  const handleCardClick = (card) => {
    setPlayerCards(playerCards.filter(c => c !== card));
    setPlayerCardsOnBoard(prevState => {
      const updatedState = {
        ...prevState,
        [card.cardClass]: [...prevState[card.cardClass], card]
      };
      return updatedState;
    });
    setScore(prevScore => prevScore + card.power);
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