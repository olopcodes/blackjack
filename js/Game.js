class Game {
  constructor(id) {
    this.deckId = id;
    this.player = new Player();
    this.dealer = new Player();
    this.cards = [];
  }
}

class Player {
  constructor() {
    this.sum = 0;
    this.hasBlackjack = false;
  }
}
