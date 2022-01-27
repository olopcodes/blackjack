class Player {
  constructor() {
    this.sum = 0;
    this.hasBlackjack = false;
  }

  set playerChips(n) {
    this.chips = n;
  }

  set incrementBet(n) {
    this.chips += n;
  }

  set decrementBet(n) {
    this.chips -= n;
  }
}
