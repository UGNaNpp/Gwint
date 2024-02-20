
// myCards - tablica
// zwraca dane zagranej karty
// TODO implementacja losowego passa
// * jeśli pass zwraca null
async function usedCard (myCards) {
  // TODO przetestować poniższą linijkę 
  const actCardIndex = Math.floor(Math.random() * myCards.length);
  console.log("dane karty wybranej przez bota", myCards[actCardIndex]);
  return myCards[actCardIndex];
}

module.exports = {usedCard};