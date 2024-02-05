import React from 'react';

const CardDisplay = ({ name, cardClass, power, onClick }) => (
  <div className="card" onClick={onClick}>
    <div>{name}</div>
    <div>{cardClass}</div>
    <div>{power}</div>
  </div>
);

export default CardDisplay;
