import React, { useState, useEffect } from 'react';
import allCards from '../Cards/allCards.js';
import './Board.css';

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);
  const [playerCardsOnBoard, setPlayerCardsOnBoard] = useState({
    melee: [],
    ranged: [],
    ballista: [],
  });

  useEffect(() => {
    let cards = [...allCards];
    cards.sort(() => Math.random() - 0.5);
    setPlayerCards(cards.slice(0, 10));
  }, []);

  const handleCardClick = (card) => {
    setPlayerCards(playerCards.filter(c => c !== card));
    setPlayerCardsOnBoard(prevState => ({
      ...prevState,
      [card.cardClass]: [...prevState[card.cardClass], card]
    }));
  };

  return (
    <div className="game">
      <div className="board">
        <div className="row opponent-row ballista"></div>
        <div className="row opponent-row ranged"></div>
        <div className="row opponent-row melee"></div>
        <div className="row player-row melee">
          {playerCardsOnBoard.melee.map((card, index) => (
            <div key={index} className="card">
              <div>{card.name}</div>
              <div>{card.cardClass}</div>
              <div>{card.power}</div>
            </div>
          ))}
        </div>
        <div className="row player-row ranged">
          {playerCardsOnBoard.ranged.map((card, index) => (
            <div key={index} className="card">
              <div>{card.name}</div>
              <div>{card.cardClass}</div>
              <div>{card.power}</div>
            </div>
          ))}
        </div>
        <div className="row player-row ballista">
          {playerCardsOnBoard.ballista.map((card, index) => (
            <div key={index} className="card">
              <div>{card.name}</div>
              <div>{card.cardClass}</div>
              <div>{card.power}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="cards">
        {playerCards.map((card, index) => (
          <div key={index} className="card" onClick={() => handleCardClick(card)}>
            <div>{card.name}</div>
            <div>{card.cardClass}</div>
            <div>{card.power}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;