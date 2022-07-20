class Player{

    IN_GAME = "inGame";
    IN_POOL = "inPool";

    constructor(name, socketId, status){
        this.socketId = socketId;
        this.name = name;
        this.symbol = `X`;
        if (!this.playerStatus){
            this.playerStatus = "inPool";
        } else {
            this.playerStatus = status;
        }
        this.lastActivity = Date.now();
        this.turn = false;
    }
}
module.exports = Player;
