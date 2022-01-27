const startBtn = document.getElementById("start-btn");
const header = document.getElementById("blackjack-header");
const board = document.querySelector(".blackjack__board");
// const betBtns = document.querySelector("#blackjack-bet-btns");
// const playerEl = document.getElementById("player-el");
// let game;
console.log(board);
// get a new deck of cards from the api
startBtn.addEventListener("click", async (e) => {
  header.classList.add("hide");
  board.classList.remove("hide");
  const id = await getDeckId();
  game = new Game(id);
});

// this should run when the bet button is pressed
// const cards = await drawCards(game.deckId, 4);
// for (let c of cards) {
//   game.cards.push(c);
// }
// console.log(game.cards);
