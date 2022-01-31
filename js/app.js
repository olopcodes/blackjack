const startBtn = document.getElementById("start-btn");
const header = document.getElementById("blackjack-header");
const board = document.querySelector(".blackjack__board");
const blackjackBoxes = document.querySelectorAll(".blackjack__box");
const coinsEl = document.querySelector("#coins span");
const betEl = document.getElementById("player-bet");
const playerBoard = document.getElementById("blackjack-player");
const dealerBoard = document.getElementById("blackjack-dealer");
const playerButtons = document.getElementById("player-btns");
const playerBoardButtons = playerBoard.querySelectorAll("button");
const blackjackButtons = document.querySelector(".blackjack__btns");
const gameMessage = document.getElementById("game-message");
const anotherRoundButton = document.getElementById("another-round");
let game;

console.log(gameMessage.textContent);

// get a new deck of cards from the api
startBtn.addEventListener("click", async (e) => {
  header.classList.add("hide");
  board.classList.remove("hide");
  const id = await getDeckId();
  game = new Game(id, coinsEl, betEl);
});

blackjackButtons.addEventListener("click", async (e) => {
  if (e.target.id === "decrease-bet") {
    // decrease wager
    game._decreaseBet();
  } else if (e.target.id === "increase-bet") {
    // increase wager
    game._increaseBet();
  } else if (e.target.id === "bet-btn") {
    // show boxes
    removeClassFromArr(blackjackBoxes, "hide");
    // playerButtons.classList.remove("hide");
    // get cards
    const cards = await drawCards(game._deckId, 2);
    const cardsTwo = await drawCards(game._deckId, 2);

    // format the way i want the data and store it
    const cardData = game._formatCards(cards);
    const cardDataTwo = game._formatCards(cardsTwo);

    // this will create a new player object and add the cards to it
    game._createPlayer("player", cardData);
    game._createPlayer("dealer", cardDataTwo);

    // render player info to the dom
    game._player._renderPlayerInfo(playerBoard);
    game._dealer._renderPlayerInfo(dealerBoard);

    // hide bet btns until next round
    addClassName([blackjackButtons], "hide");

    // check if player has blackjack
    game._checkBlackJack(gameMessage);
    // endRound();

    // deletes coin betted to coins the player has
    game._betCoins();
  }
});

// player buttons listenr
playerButtons.addEventListener("click", async (e) => {
  if (e.target.id === "player-stands") {
    // showing the dealers hand
    showDealerHand(dealerBoard);

    // check if dealer got blackjack
    game._checkDealerSum(gameMessage);

    // if dealer has blackjack

    let interval = setInterval(async () => {
      let n;
      if (game._dealer._sum === 16) {
        n = Math.random();
      }

      if (n > 0.5) clearInterval(interval);

      const card = await drawOneCard();
      game._addCard("dealer", card);
      game._dealer._renderPlayerInfo(dealerBoard);
      showDealerHand(dealerBoard);

      game._checkBlackJack(gameMessage);
      if (game._dealer._sum === 21) clearInterval(interval);

      game._checkPlayerRound(gameMessage);
      if (!game._gamePlaying) clearInterval(interval);
    }, 750);

    // once no new card drawn, see who one the round
  } else if (e.target.id === "player-hit") {
    // drawing one card from the deck
    const card = await drawOneCard();

    // entering new card info in the player obj
    game._addCard("player", card);

    // render info to the dom
    game._player._renderPlayerInfo(playerBoard);

    // see if player goes over 21 or gets blackjack
    game._checkPlayerSum(gameMessage);

    // end game
    game._endRound(anotherRoundButton, playerBoard);
  }
});

anotherRoundButton.addEventListener("click", (e) => {
  game._resetValues(anotherRoundButton, gameMessage, playerBoard, board);
});
