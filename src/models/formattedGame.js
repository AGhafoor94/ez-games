module.exports = class GamesClass {
  constructor(gameId, coverGameId, name, summary, url) {
    (this.gameId = gameId),
      (this.coverGameId = coverGameId),
      (this.url = url),
      (this.name = name),
      (this.summary = summary);
  }
  addToArray() {
    let array;
    if (this.gameId === this.coverGameId) {
      array.push(this.gameId, this.name, this.summary, this.url);
      console.log(array);
    }
  }
};
