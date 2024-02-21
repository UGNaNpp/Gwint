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

  // karty przydzielone graczowi (karty w ręce)
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
  const [enemyScore, setEnemyScore] = useState(0);

  //logika spasowania oraz kryształy
  const [playerPassed, setPlayerPassed] = useState(false);
  const [opponentPassed, setOpponentPassed] = useState(false);
  const [playerCrystals, setPlayerCrystals] = useState(2);
  const [opponentCrystals, setOpponentCrystals] = useState(2);
  
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
  
    useEffect(() => {
      startGame()
    }, []);

  useEffect(() => {
    console.log(playerPassed);
  }, [playerPassed]);

  const [botMoves, setBotMoves] = useState(0);


  // czy gracz ma teraz ruch
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  //  kliknięcie w kartę
  const handleCardClick = (card) => {
    if (!isPlayerTurn || playerPassed) {
      return; // jak nie masz ruchu lub spasowałeś to nie klikniesz
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

    if (!opponentPassed) {
      setIsPlayerTurn(false);
      botMove();
    }
  };

  //jesli obydwoje gracze spasowali, koniec rundy i reset statystyk
  if (playerPassed && opponentPassed) {
    if (score > enemyScore) {
      setOpponentCrystals(prevCrystals => prevCrystals - 1);
    } else if (score < enemyScore) {
      setPlayerCrystals(prevCrystals => prevCrystals - 1);
    }

    setPlayerPassed(false);
    setOpponentPassed(false);
    setScore(0);
    setEnemyScore(0);
    setBotMoves(0);

  }

  const handlePassClick = () => { //pasujemy
    if (isPlayerTurn && !playerPassed) {
      setPlayerPassed(true);
      setIsPlayerTurn(false);

      // Po spasowaniu gracza, bot wykonuje ruch
      botMove(true);
    }
  };

  useEffect(() => {
    console.log(playerPassed);
  }, [playerPassed]);

  const botMove = (playerHasPassed) => {
    setTimeout(() => {
      if (opponentCards.length > 0 && !opponentPassed) {
        const passChance = botMoves * 0.00; // szansa na spasowanie bota rośnie z każdym ruchem
        const e = Math.random()
        console.log(e, "musi byc mniejsze od ", passChance)
        if (e < passChance) {
          console.log('chlop spasował')
          setOpponentPassed(true);
          setIsPlayerTurn(true);
        } else {
          const botCardIndex = Math.floor(Math.random() * opponentCards.length);
          const botCard = opponentCards[botCardIndex];
          setBotMoves(prevMoves => prevMoves + 1);
  
          setOpponentCards(opponentCards.filter((c, index) => index !== botCardIndex));
          setOpponentCardsOnBoard(prevState => {
            const updatedState = {
              ...prevState,
              [botCard.cardClass]: [...prevState[botCard.cardClass], botCard]
            };
            return updatedState;
          });
  
          setEnemyScore(prevScore => prevScore + botCard.power);
          console.log("czy ja spasowalem?", playerHasPassed)
  
          if (!playerHasPassed) { // gracz ma ruch o ile wczesniej nie spasował
            setIsPlayerTurn(true);
          } else {
            // Jeśli gracz spasował, bot wykonuje kolejny ruch
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
          <button onClick={handlePassClick}
          className="passButton"
          >Spasuj</button>
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
