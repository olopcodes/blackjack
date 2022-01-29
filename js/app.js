const startBtn = document.getElementById("start-btn");
const header = document.getElementById("blackjack-header");
const board = document.querySelector(".blackjack__board");
const blackjackBoxes = document.querySelectorAll(".blackjack__box");
const coinsEl = document.querySelector("#coins span");
const betEl = document.getElementById("player-bet");
const playerBoard = document.getElementById("blackjack-player");
const dealerBoard = document.getElementById("blackjack-dealer");

const blackjackButtons = document.querySelector(".blackjack__btns");
let game;

// get a new deck of cards from the api
startBtn.addEventListener("click", async (e) => {
  header.classList.add("hide");
  board.classList.remove("hide");
  const id = await getDeckId();
  game = new Game(id, coinsEl, betEl);
});

blackjackButtons.addEventListener("click", async (e) => {
  if (e.target.id === "decrease-bet") {
    game._decreaseBet();
  } else if (e.target.id === "increase-bet") {
    game._increaseBet();
  } else if (e.target.id === "bet-btn") {
    removeClassFromArr(blackjackBoxes);
    // get cards
    const cards = await drawCards(game._deckId, 2);
    const cardsTwo = await drawCards(game._deckId, 3);

    // generates new player obj and stores info to the named obj
    game._generatePlayerInfo(cards, "player");
    game._generatePlayerInfo(cardsTwo, "dealer");

    // render player info to the dom
    game._player._renderPlayerInfo(playerBoard);
    game._dealer._renderPlayerInfo(dealerBoard);

    // deletes coin betted to coins the player has
    game._betCoins();
  }
});
