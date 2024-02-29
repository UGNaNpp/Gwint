import React from "react";
import CardDisplay from "./CardDisplay.js";

export default function BoardRow({cardType, whose, cardsOnBoard}) {
  const className=`row ${cardType} ${whose} `

  return (
    <div className={className} >
          {cardsOnBoard[cardType].map((card, index) => (
            <CardDisplay key={index} {...card} />
          ))}
    </div>
  )
}