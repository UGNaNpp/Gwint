import React, { useState, useEffect } from 'react';
import allCards from '../Cards/allCards.js';
import './Board.css';

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);

  useEffect(() => {
    let cards = [...allCards];
    cards.sort(() => Math.random() - 0.5);
    setPlayerCards(cards.slice(0, 10));
  }, []);

  return (
    <div className="game">
      <div className="board">
        <div className="row opponent-row ballista"></div>
        <div className="row opponent-row ranged"></div>
        <div className="row opponent-row melee"></div>
        <div className="row player-row melee"></div>
        <div className="row player-row ranged"></div>
        <div className="row player-row ballista"></div>
      </div>
      <div className="cards">
        {playerCards.map((card, index) => (
          <div key={index} className="card">
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