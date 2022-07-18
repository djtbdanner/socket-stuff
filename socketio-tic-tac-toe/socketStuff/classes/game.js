const crypto = require("crypto");
class Game {
    constructor(player1, player2 ) {
        this.id = crypto.randomBytes(16).toString("hex");
        this.player1 = player1;
        this.player2 = player2;
        this.players = [];
        this.players.push(player1);
        this.players.push(player2);
        this.board = [``,``,``,``,``,``,``,``,``];
        this.winner = undefined;
        this.draw = false;
    }

    reset (){
        this.players = [];
        this.players.push(this.player1);
        this.players.push(this.player2);
        this.board = [``,``,``,``,``,``,``,``,``];
        this.winner = undefined;
        this.draw = false;        
    }
    
}
module.exports = Game;