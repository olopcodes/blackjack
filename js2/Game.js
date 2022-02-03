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
      } else if (e.target.id === "player-hit") {
        await this._runPlayerHitsLogic();
      } else if (e.target.id === "player-stands") {
        this._checkFinalSumCards();
        this._dealer._showDealerHand();
        await this._dealerDrawCard();

        // add function to display msgs to the dom if not there
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
    this._checkPlayerSumCards();
    this._endRound();
  }

  // player hit logic
  async _runPlayerHitsLogic() {
    // draw new card, update array
    const data = await this._drawCards(1);
    const card = this._formatCardData(data);
    this._updateCards(card, "player");

    // sum new array
    this._player._getCardSum();
    this._player._showPlayerSum();

    //  render cards again
    this._player._renderCards("player");

    // check the sum
    this._checkPlayerSumCards();

    // end round
    this._endRound();
  }

  // player stands / dealer logic

  _checkDealerSum() {
    const n = Math.random();
    const dealerSum = this._dealer._sum;
    if (dealerSum >= 19) {
      return 0;
    } else if (dealerSum === 18 && n > 0.9) {
      return 1;
    } else if (dealerSum === 17 && n > 0.7) {
      return 1;
    } else if (dealerSum === 16 && n > 0.5) {
      return 1;
    } else if (dealerSum === 15 && n > 0.35) {
      return 1;
    } else {
      return 1;
    }
  }

  async _dealerDrawCard() {
    const x = this._checkDealerSum();
    if (x === 1) {
      const data = await this._drawCards(1);
      const card = this._formatCardData(data);
      this._updateCards(card, "dealer");
      this._dealer._getCardSum();

      this._dealer._showDealerHand();
      this._dealer._renderCards("dealer");
    }
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

  _addClassFromArr(arr, className) {
    for (let item of arr) {
      item.classList.add(className);
    }
  }

  // update cards arr
  _updateCards(arr, name) {
    for (let item of arr) {
      if (name === "player") {
        this._player._cards.push(item);
      } else if (name === "dealer") {
        this._dealer._cards.push(item);
      }
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

  // calc coins/bet ============================================
  _placeBet() {
    this._coins -= this._bet;
    this._gameBoard.querySelector("#coins span").textContent = this._coins;
  }

  _handleWinnings(x) {
    let w;
    if (x === 1) {
      // for blackjack
      w = this._bet * 3;
    } else if (x === 0) {
      // for win
      w = this._bet * 2;
    } else {
      w = this._bet;
    }

    this._coins = w;
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

  // calc winner
  _checkPlayerSumCards() {
    let x;
    const msg = this._gameBoard.querySelector("#game-message");
    if (this._player._sum > 21) {
      msg.textContent = "Dealer wins!";
      this._isPlaying = false;
    } else if (this._player._sum === 21) {
      x = 1;
      msg.textContent = "you got blackjack!!";
      this._isPlaying = false;
      this._handleWinnings(1);
    }
  }

  _checkFinalSumCards() {
    let x;
    if (this._dealer._sum > 21) {
      console.log("player won");
      x = 1;
    } else if (this.dealer._sum === 21) {
      console.log("dealer got blackjack");
      x = 1;
    } else if (this._dealer._sum > this._player._sum) {
      console.log("dealer wins round!!");
      x = 1;
    } else if (this._player._sum > this._dealer._sum) {
      console.log("you won the round");
      x = 1;
    } else if (this._player._sum === this._dealer._sum) {
      console.log("push, it is a tie!");
      x = 1;
    }

    if (x === 1) this._isPlaying = false;
  }

  //   formatting the data from fetched cards
  _formatCardData(arr) {
    // using return twice because you are storing it in the function
    return arr.map((item) => {
      return { image: item.image, value: item.value };
    });
  }

  // ending the game round
  _endRound() {
    if (!this._isPlaying) {
      // hide pointer events on buttons
      const btns = this._gameBoard.querySelectorAll("#player-btns button");
      this._addClassFromArr(btns, "hide-events");
      // show another round button
      this._toggleClass(
        this._gameBoard.querySelector("#another-round"),
        "hide"
      );
    }
  }

  // resetting the round
  _roundReset() {
    // remove cards from both
    // remove sum
    // hide cards/images and the card wrapper
    // reset value of bet and coins
    // show the bet buttons again
  }

  //   fetching cards info from api ========================================
  async _getDeckId() {
    const res = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=10"
    );
    const data = await res.json();
    return data.deck_id;
  }

  async _drawCards(num) {
    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/${this._deckId}/draw/?count=${num}`
    );
    const data = await res.json();
    return data.cards;
  }
}
