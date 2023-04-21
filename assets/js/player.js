export default class Player {
  constructor(name) {
    this._name = name;
    this._score = 0;
    this._tries = 0;
    this.wordLength = 0;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value;
  }

  get tries() {
    return this._tries;
  }

  set tries(value) {
    this._tries = value;
  }

  playerFailed() {
    this._tries--;
    this.checkIfLost();
  }

  playerTrue() {
    this._score++;
  }

  checkIfLost() {
    return this._tries === 0;
  }
}
