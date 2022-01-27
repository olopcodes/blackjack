class Game {
  constructor(id) {
    this.deckId = id;
    this.player = new Player();
    this.dealer = new Player();
    this.cards = [];
  }
}
