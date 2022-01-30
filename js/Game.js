class Game {
  constructor(id, coinsEl, betEl) {
    this._deckId = id;
    this._coinsEl = coinsEl;
    this._betEl = betEl;
    this._coins = 500;
    this._bet = 10;
    this._player;
    this._dealer;
    this._gamePlaying = true;
  }

  _decreaseBet() {
    if (this._bet > 0) {
      this._bet -= 5;
      this._betEl.textContent = this._bet;
    } else {
      alert("Bet has to be greater than 0");
    }
  }

  _increaseBet() {
    this._bet += 5;
    this._betEl.textContent = this._bet;
  }

  _betCoins() {
    if (this._bet > 0) {
      this._coins -= this._bet;
      this._coinsEl.textContent = this._coins;
    } else {
      alert("Bet has to be greater than 0");
    }
  }

  _formatCards(arr) {
    let newCards = [];
    for (let item of arr) {
      newCards.push({ image: item.image, value: item.value });
    }
    return newCards;
  }

  _createPlayer(name, newCards) {
    if (name === "dealer") {
      this._dealer = new Player(newCards);
    } else if (name === "player") {
      this._player = new Player(newCards);
    }
  }

  _addCard(name, card) {
    if (name === "player") {
      this._player._cards.push(card);
    } else {
      this._dealer._cards.push(card);
    }
  }

  // work on logic for the end of round
  _checkBlackJack(el) {
    let x = 0;
    let msg;
    if (this._player._sum === 21) {
      msg = "you got blackjack!";
      x = 1;
      this._addCoins(1);
      this._player._hasBlackjack = true;
    } else if (this._dealer._sum === 21) {
      x = 1;
      msg = "the dealer got blackjack!";
      this._dealer._hasBlackjack = true;
    }

    if (x > 0) this._player._playing = false;
    if (!msg) msg = "playing game";
    this._alertWinner(el, msg);
    // this._checkRound(el);
  }

  // work on logic for the end of the round ===========

  _checkRound(el) {
    let msg;

    if (this._player._sum > this._dealer._sum) {
      msg = "you won the round!";
      this._addCoins(0);
    } else if (this._player._sum < this._dealer._sum) {
      msg = "dealer won the round!";
    } else if (this._player._sum === this._dealer._sum) {
      msg = "push, it is a tie!";
      this._addCoins(0);
    }

    this._alertWinner(el, msg);
    this._gamePlaying = false;
  }

  // work on logic for the end of round
  _checkPlayerRound(el) {
    let msg;
    if (this._player._sum > 21) {
      msg = "Dealer wins!";
      this._gamePlaying = false;
    } else if (this._dealer._sum > 21) {
      msg = "You win!";
      this._addCoins(0);
      this._gamePlaying = false;
    }

    if (!msg) msg = "playing round";
    this._alertWinner(el, msg);
  }

  _alertWinner(el, msg) {
    el.textContent = msg;
  }

  _reset() {
    this._player._sum = 0;
    this._player._cards = [];
    this._dealer._sum = 0;
    this._dealer._cards = [];
  }

  _addCoins(x) {
    let pot;
    if (x === 1) {
      pot = this._bet * 2;
    } else if (x === "tie") {
      pot = this._bet;
    }
    this._coins += pot;
    this._coinsEl.textContent = this._coins;
  }
}

class Player {
  constructor(cards) {
    this._sum = 0;
    this._hasBlackjack = false;
    this._cards = cards;
    this._playing = true;
  }

  // add cards to get sum
  _renderPlayerInfo(el) {
    let html = "";
    el.querySelector(".blackjack__cards-wrapper").innerHTML = "";
    for (let item of this._cards) {
      html += `
        <div>
          <img src="${item.image}" />
        </div>
      `;
    }
    el.querySelector(".blackjack__cards-wrapper").innerHTML = html;

    this._renderSum(el);
  }

  _evaluateCards() {
    let total = 0;
    for (let card of this._cards) {
      if (
        card.value === "KING" ||
        card.value === "JACK" ||
        card.value === "QUEEN"
      ) {
        total += 10;
      } else if (card.value === "ACE") {
        if (total + 11 > 21) {
          total += 1;
        } else {
          total += 11;
        }
      } else {
        total += Number(card.value);
      }
    }

    this._sum = total;
  }

  _renderSum(el) {
    this._evaluateCards();
    el.querySelector(".blackjack-sum span").textContent = this._sum;
  }
}
