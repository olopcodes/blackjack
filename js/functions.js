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

function removeClassFromArr(arr, className) {
  for (let item of arr) {
    item.classList.remove(className);
  }
}

function addClassName(el, className) {
  el.classList.add(className);
}

function showDealerHandonStand(el) {
  el.querySelector(
    ".blackjack__cards-wrapper div:nth-of-type(2) img"
  ).style.opacity = 1;
}
