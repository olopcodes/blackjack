// all variables for the game
const startButton = document.getElementById("start-btn");
const gameBoard = document.querySelector(".blackjack__board");
const msgEl = document.getElementById("game-message");
const header = document.querySelector("header");
let game;

startButton.addEventListener("click", () => {
  //   show the game board
  gameBoard.classList.remove("hide");
  //   hide the header
  header.classList.add("hide");
  game = new Game(gameBoard, msgEl);
});
