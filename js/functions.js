async function getDeckId() {
  const res = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
  );
  const data = await res.json();
  return data.deck_id;
}

async function drawCards(id, n) {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${id}/draw/?count=${n}`
  );
  const data = await res.json();
  return data.cards;
}

// async function updateCards(id, n) {
//   const newCards = await this.drawCards(id, n);
//   for (let card of newCards) {
//     this.cards.push(card);
//   }
// }
