class Game {
  constructor(id, coinsEl, betEl) {
    this._deckId = id;
    this._coinsEl = coinsEl;
    this._betEl = betEl;
    this._coins = 500;
    this._bet = 10;
    this._player;
    this._dealer;
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

  // fix how this is implemented
  // the logic does not work!!
  _generatePlayerInfo(arr, name) {
    let newCards = [];
    for (let item of arr) {
      newCards.push({ image: item.image, value: item.value });
    }

    if (name === "dealer") {
      this._dealer = new Player(newCards);
    } else if (name === "player") {
      this._player = new Player(newCards);
    }
  }

  _wonGame() {
    const pot = this._coins + this._bet * 2;
    this._coins += pot;
    this._coinsEl.textContent = this._coins;
  }
}

class Player {
  constructor(cards) {
    this._sum = 0;
    this._hasBlackjack = false;
    this._cards = cards;
  }

  // add cards to get sum
  _renderPlayerInfo(el) {
    for (let item of this._cards) {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = item.image;
      div.appendChild(img);
      el.querySelector(".blackjack__cards-wrapper").appendChild(div);
    }

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
