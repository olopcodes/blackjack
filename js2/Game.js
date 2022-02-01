class Game {
  constructor(boardEl, msgEl) {
    this._msgEl = msgEl;
    this._isPlaying = true;
    this._gameBoard = boardEl;
    this._coins = 500;
    this._bet = 10;
    boardEl.addEventListener("click", async (e) => {
      if (e.target.id === "bet-btn") {
        await this._runGame();
      } else if (e.target.id === "decrease-bet") {
        this._decreaseBet();
      } else if (e.target.id === "increase-bet") {
        this._increaseBet();
      }
    });
  }

  //   entire game logic
  async _runGame() {
    this._deckId = await this._getDeckId();
    this._showBoardBoxes();
    await this._createNewPlayer("player");
    await this._createNewPlayer("dealer");
    this._player._getCardSum();
    this._dealer._getCardSum();
    this._player._showPlayerSum();
    this._placeBet();
    this._player._renderCards("player");
    this._dealer._renderCards("dealer");
  }

  //   fetching the deck id and cards from api
  async _getDeckId() {
    const res = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=10"
    );
    const data = await res.json();
    return data.deck_id;
  }

  // show the game board
  _showBoardBoxes() {
    const boxes = this._gameBoard.querySelectorAll(".blackjack__box");
    this._removeClassFromArr(boxes, "hide");

    const el = this._gameBoard.querySelector(".blackjack__btns");
    this._toggleClass(el, "hide");
  }

  //   remove class from array
  _removeClassFromArr(arr, className) {
    for (let item of arr) {
      item.classList.remove(className);
    }
  }

  //   remove class from one el
  _toggleClass(el, className) {
    el.classList.toggle(className);
  }

  //   create a new player obj adding cards and board
  async _createNewPlayer(name) {
    const cardData = await this._drawCards(2);
    const data = this._formatCardData(cardData);

    if (name === "player") {
      this._player = new Player(data, this._gameBoard);
    } else {
      this._dealer = new Dealer(data, this._gameBoard);
    }
  }

  // calc coins

  _placeBet() {
    this._coins -= this._bet;
    this._gameBoard.querySelector("#coins span").textContent = this._coins;
  }

  _increaseBet() {
    if (this._bet <= this._coins) {
      this._bet += 5;
    }
    this._gameBoard.querySelector("#player-bet").textContent = this._bet;
  }

  _decreaseBet() {
    if (this._bet > 5) {
      this._bet -= 5;
    }
    this._gameBoard.querySelector("#player-bet").textContent = this._bet;
  }

  //   fetching cards
  async _drawCards(num) {
    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/${this._deckId}/draw/?count=${num}`
    );
    const data = await res.json();
    return data.cards;
  }

  //   formatting the data from fetched cards
  _formatCardData(arr) {
    // using return twice because you are storing it in the function
    return arr.map((item) => {
      return { image: item.image, value: item.value };
    });
  }
}
