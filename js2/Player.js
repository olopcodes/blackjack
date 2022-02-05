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

  _renderCards(name) {
    let html = "";
    let el;
    if (name === "player") {
      el = this._gameBoard.querySelector(
        "#blackjack-player .blackjack__cards-wrapper"
      );
    } else if ("dealer") {
      el = this._gameBoard.querySelector(
        "#blackjack-dealer .blackjack__cards-wrapper"
      );
    }
    el.innerHTML = "";
    for (let c of this._cards) {
      html += `
        <div>
          <img src="${c.image}"/>
        </div>
      `;
    }

    el.innerHTML = html;
  }
}

// practicing extending and object
class Dealer extends Player {
  constructor(cards, boardEl) {
    super(cards, boardEl);
  }

  _showDealerHand() {
    const el = this._gameBoard.querySelector(
      "#blackjack-dealer .blackjack-sum span"
    );
    el.textContent = this._sum;
    el.style.opacity = 1;
    this._showSecondCard();
  }

  _showSecondCard() {
    this._gameBoard
      .querySelector(".blackjack__cards-wrapper div:nth-of-type(2) img")
      .classList.add("show-opacity");
  }

  _hideDealerSum() {
    this._gameBoard.querySelector(
      "#blackjack-dealer .blackjack-sum span"
    ).style.opacity = 0;
  }
}
