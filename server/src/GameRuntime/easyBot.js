
// myCards - tablica
// zwraca dane zagranej karty
// TODO implementacja losowego passa
// * pass przesyłamy jako cardData = null
// * jeśli pass przeciwnika zwraca null
function makeMove (myCards) {
  if (myCards.length === 0) {
    return null
  } else {
    const actCardIndex = Math.floor(Math.random() * myCards.length);
    return myCards[actCardIndex];
  }
}
  
module.exports = {makeMove};
