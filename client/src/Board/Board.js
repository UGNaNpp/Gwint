import React, { useState, useEffect } from 'react';
import allCards from '../Cards/allCards.js';

const Board = () => {
  const [playerCards, setPlayerCards] = useState([]);

  useEffect(() => {
    let cards = [...allCards];
    cards.sort(() => Math.random() - 0.5);
    setPlayerCards(cards.slice(0, 10));
  }, []);

  return (
    <div>
      plansza
      {playerCards.map((card, index) => (
        <div key={index}>
          {card.name}
        </div>
      ))}
    </div>
  );
}

export default Board;