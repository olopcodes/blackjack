// use local storage and set the player object

async function getDecks() {
  const res = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
  );
  const data = await res.json();
  return data.deck_id;
}

// the cards from here should stored in the cards array
async function getCards(num) {
  const deckId = await getDecks();
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`
  );
  const data = await res.json();
  console.log(data);
}

// getCards(2);
// getCards(1);

let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";

const playerEl = document.getElementById("player-el");
const cardsEl = document.getElementById("cards-el");
const sumEl = document.getElementById("sum-el");
const messageEl = document.getElementById("message-el");
const player = {
  name: "",
  chips: 150,

  updatePlayerName() {
    // check if info in localStorage, if not run prompt
    this.name = prompt("Enter your name");
  },

  printName() {
    console.log(this.name);
  },

  renderPlayerInfo() {},
};

function startGame() {
  //   as long as player chips > 0
  isAlive = true;
  //   player.updatePlayerName();
  //   player.printName();
  cards = [];
  let firstCard = getRandomCard();
  cards.push(firstCard);
  let secondCard = getRandomCard();
  cards.push(secondCard);
  sum = firstCard + secondCard;
  renderGame();
  console.log(cards);
}

function getRandomCard() {
  const n = Math.floor(Math.random() * 13) + 1;
  if (n === 1) {
    return 11;
  } else if (n > 10) {
    return 10;
  } else {
    return n;
  }
}

function renderCards() {
  cardsEl.textContent = `Cards: `;
  for (let i = 0; i < cards.length; i++) {
    cardsEl.textContent += cards[i] + " ";
  }
}

function renderGame() {
  renderCards();

  sumEl.textContent = `Sum: ${sum}`;
  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
  } else {
    message = "You're out of the game!";
    isAlive = false;
  }

  messageEl.textContent = message;
}

function newCard() {
  // as long as player is still alive and has not got blackjack

  if (isAlive && !hasBlackJack) {
    const card = getRandomCard();
    sum += card;
    cards.push(card);
    console.log(cards);
    renderGame();
  }
}
// const game = new Game();

const game = new Game();
game.getDeckId();
// game.drawCards();
// game.setDeckId();
game.deckId = await game.setDeckId();

// game.drawCards(4);
// console.log(game.deckId);
