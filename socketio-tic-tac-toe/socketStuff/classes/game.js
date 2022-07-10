const crypto = require("crypto");
class Game {
    constructor(player1, player2, words = []) {
        this.id = crypto.randomBytes(16).toString("hex");
        this.player1 = player1;
        this.player2 = player2;
    }
}
module.exports = Game;