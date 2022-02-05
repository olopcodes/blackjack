class Game {
  constructor(boardEl, msgEl) {
    this._msgEl = msgEl;
    this._isPlaying = true;
    this._gameBoard = boardEl;
    this._coins = 500;
    this._bet = 10;
    boardEl.addEventListener("click", async (e) => {
      if (e.target.id === "bet-btn") {
        this._gameBoard.querySelector("#player-btns").classList.remove("hide");

        await this._runGame();
      } else if (e.target.id === "decrease-bet") {
        this._decreaseBet();
      } else if (e.target.id === "increase-bet") {
        this._increaseBet();
      } else if (e.target.id === "player-hit") {
        await this._runPlayerHitsLogic();
      } else if (e.target.id === "player-stands") {
        await this._runDealerLogic();
      } else if (e.target.id === "another-round") {
        this._roundReset();
      }
    });
  }

  //   entire game logic
  async _runGame() {
    this._printMessage("playing round");
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
    this._checkIndividualSum("player");
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
    this._checkIndividualSum("player");

    // end round
    this._endRound();
  }

  // player stands / dealer logic

  async _runDealerLogic() {
    this._dealer._showDealerHand();
    this._checkIndividualSum("dealer");

    const val = this._checkDealerSum();
    if (val === 0) {
      this._compareFinalSum();
      this._endRound();
    } else {
      let interval = setInterval(async () => {
        const x = this._checkDealerSum();
        if (x === 1) {
          await this._dealerDrawCard();
          this._dealer._showSecondCard();
          this._checkIndividualSum("dealer");
          if (this._isPlaying === false) {
            this._endRound();
            clearInterval(interval);
          }
        } else {
          this._compareFinalSum();
          this._endRound();
          clearInterval(interval);
        }
      }, 750);
    }
  }

  _checkDealerSum() {
    const n = Math.random();
    const dealerSum = this._dealer._sum;
    if (dealerSum >= 19 || dealerSum > this._player._sum) {
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
    const data = await this._drawCards(1);
    const card = this._formatCardData(data);
    this._updateCards(card, "dealer");
    this._dealer._getCardSum();
    this._dealer._showDealerHand();
    this._dealer._renderCards("dealer");
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

  _handleWinnings(winner) {
    if (winner === "player") {
      this._coins += this._bet * 2;
    } else if (winner === "blackjack") {
      this._coins += this._bet * 3;
    } else if (winner === "tie") {
      this._coins += this._bet;
    }
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
  _checkIndividualSum(name) {
    let x;
    let w;
    if (name === "player") {
      if (this._player._sum > 21) {
        this._printMessage("Dealer wins!");
        x = 1;
        w = "dealer";
      } else if (this._player._sum === 21) {
        x = 1;
        w = "blackjack";
        this._printMessage("you got blackjack!!");
      }
    } else if (name === "dealer") {
      if (this._dealer._sum > 21) {
        this._printMessage("You win");
        x = 1;
        w = "player";
      } else if (this._dealer._sum === 21) {
        x = 1;
        w = "dealer";
        this._printMessage("dealer got blackjack!!");
      }
    }
    if (x === 1) this._isPlaying = false;
    this._handleWinnings(w);
  }

  _compareFinalSum() {
    let w;
    if (this._player._sum > this._dealer._sum) {
      w = "player";
      this._printMessage("you win!!");
    } else if (this._player._sum < this._dealer._sum) {
      w = "dealer";
      this._printMessage("dealer wins!!");
    } else {
      w = "tie";
      this._printMessage(`push, it's a tie!!`);
    }

    this._isPlaying = false;
    this._handleWinnings(w);
  }

  _checkFinalSumCards() {
    let y;

    let x;
    if (this._dealer._sum > 21) {
      this._printMessage("player won");
      x = 1;
      y = 0;
      return y;
    } else if (this._dealer._sum === 21) {
      this._printMessage("dealer got blackjack");
      x = 1;
    } else if (this._dealer._sum > this._player._sum) {
      this._printMessage("dealer wins round!!");
      x = 1;
    } else if (this._player._sum > this._dealer._sum) {
      this._printMessage("you won the round");
      x = 1;
      y = 0;
      return y;
    } else if (this._player._sum === this._dealer._sum) {
      this._printMessage("push, it is a tie!");
      x = 1;
    }

    if (x === 1) this._isPlaying = false;
  }

  _printMessage(msg) {
    const el = this._gameBoard.querySelector("#game-message");
    el.textContent = msg;
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
    this._printMessage("start betting");
    // remove cards from both
    this._player.cards = [];
    this._dealer.cards = [];
    // remove sum
    this._player._sum = 0;
    this._dealer._sum = 0;
    this._player._showPlayerSum();
    this._dealer._hideDealerSum();
    this._isPlaying = true;
    // hide cards/images and the card wrapper
    this._removeImgs();
    this._removeHideEvents();

    // show the bet buttons again
    const el = this._gameBoard.querySelector(".blackjack__btns");
    this._toggleClass(el, "hide");

    this._toggleClass(this._gameBoard.querySelector("#another-round"), "hide");

    this._toggleClass(this._gameBoard.querySelector("#player-btns"), "hide");
  }

  _removeHideEvents() {
    const btns = this._gameBoard.querySelectorAll("#player-btns button");
    for (let b of btns) {
      b.classList.remove("hide-events");
    }
  }

  _removeImgs() {
    const imgs = this._gameBoard.querySelectorAll(
      ".blackjack__cards-wrapper img"
    );
    for (let i of imgs) {
      i.remove();
    }
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
