
// myCards - tablica
// zwraca dane zagranej karty
// TODO implementacja losowego passa
// * jeśli pass zwraca null
async function usedCard (myCards) {
  // TODO przetestować poniższą linijkę 
  const actCardIndex = Math.floor(Math.random() * myCards.length);
  console.log("Indeks karty wybranej przez bota", actCardIndex);
  return actCardIndex;
}

module.exports = {usedCard};