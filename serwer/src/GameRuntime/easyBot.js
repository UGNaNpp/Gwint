
// myCards - tablica
// zwraca dane zagranej karty
// TODO implementacja losowego passa
// * pass przesyłamy jako cardData = null
// * jeśli pass przeciwnika zwraca null
async function usedCard (myCards) {
  const actCardIndex = Math.floor(Math.random() * myCards.length);
  console.log("dane karty wybranej przez bota", myCards[actCardIndex]);
  return myCards[actCardIndex];
}
  
module.exports = {usedCard};

// TODO Co jak skończą się karty? 