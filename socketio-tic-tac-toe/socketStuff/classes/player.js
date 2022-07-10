class Player{
    constructor(name, socketId, status){
        this.socketId = socketId;
        this.name = name;
        this.winner = false;
        if (!this.playerStatus){
            this.playerStatus = "inPool";
        } else {
            this.playerStatus = status;
        }
        this.lastActivity = Date.now();
    }
    IN_GAME = "inGame";
    IN_POOL = "inPool";
}
module.exports = Player;