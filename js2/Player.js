class Player {
  constructor(cards, boardEl) {
    this._cards = cards;
    this._sum = 0;
    this._gameBoard = boardEl;
  }

  _getCardSum() {
    let total = 0;
    for (let card of this._cards) {
      if (
        card.value === "JACK" ||
        card.value === "KING" ||
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

  _showPlayerSum() {
    this._gameBoard.querySelector(
      "#blackjack-player .blackjack-sum span"
    ).textContent = this._sum;
  }
}

// practicing extending and object
class Dealer extends Player {
  constructor(cards, boardEl) {
    super(cards, boardEl);
  }

  _showDealerSum() {
    this._gameBoard.querySelector(
      "#blackjack-dealer .blackjack-sum span"
    ).textContent = this._sum;
  }
}
