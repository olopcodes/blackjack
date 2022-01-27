const startBtn = document.getElementById("start-btn");
let game;

// get a new deck of cards from the api
startBtn.addEventListener("click", async (e) => {
  startBtn.classList.add("close");
  const id = await getDeckId();
  game = new Game(id);
});

// this should run when the bet button is pressed
// const cards = await drawCards(game.deckId, 4);
// for (let c of cards) {
//   game.cards.push(c);
// }
// console.log(game.cards);
