const socketio = require('socket.io');
const Player = require('./classes/player');
const Game = require('./classes/game');
const httpServer = require('../server').httpServer;
const io = socketio(httpServer);
// this could be a database
const games = [];
const players = [];

io.sockets.on(`connect`, (socket) => {
    console.log(`io connection, id: ${socket.id}`);

    socket.on('game-restart', (data) => {
        try {
            console.log(`io-message  ${data}`);
            socket.emit(`game-restart`, data);
        } catch (e) {
            handleError(socket, e, data);
        }
    });

    socket.on('add-player', function (data) {
        try {
            console.log(`add-player: ${JSON.stringify(data)}`)
            const playerName = data.name || randomNameGenerator(4);
            const player = addPlayertoPlayers(socket, playerName);
            console.log(players);
            const playersToPlay = players.filter((p) => p.playerStatus === p.IN_POOL);
            playersToPlay.sort((a, b) => a.name.localeCompare(b.name));
            socket.emit('add-player', { player, players: playersToPlay });
            socket.broadcast.emit(`players-updated`, { players: playersToPlay });
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('init-game', function (data) {
        try {
            const otherPlayerId = data;
            const player = players.find((p) => p.socketId === socket.id);
            const otherPlayer = players.find((p) => p.socketId === otherPlayerId);
            const game = new Game(player, otherPlayer);
            games.push(game);
            socket.emit('init-game', { player, otherPlayer });
            socket.to(otherPlayerId).emit('init-game-other', { player, otherPlayer });
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('disconnect', function () {
        try {
            console.log(`socket ${socket.id} left`);
            if (players.length > 0) {
                const leftoverPlayers = players.filter(p => p.socketId !== socket.id);
                players.splice(0);
                players.push.apply(leftoverPlayers);
                playersToPlay.sort((a, b) => a.name.localeCompare(b.name));
                socket.broadcast.emit(`players-updated`, { players: playersToPlay });
            }
        } catch (error) {
            handleError(socket, error, data);
        }
    });
});


function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `There was an error in processing.`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {
        // dont' shut down if error handling error
        console.log(e);
    }
}

function randomNameGenerator(num) {
    let res = '';
    if (!num) {
        num = 8;
    }
    for (let i = 0; i < num; i++) {
        const random = Math.floor(Math.random() * 26);
        res += String.fromCharCode(97 + random);
    };
    res = res.charAt(0).toUpperCase() + res.slice(1);
    return res;
};

function addPlayertoPlayers(socket, playerName) {
    player = players.find((p) => {
        return p.socketId === socket.id;
    });
    if (!player) {
        player = new Player(playerName, socket.id);
        players.push(player);
    }
    if (playerName && player.name !== playerName) {
        console.log(`Replacing player name ${player.name} with ${playerName}`);
        player.name = playerName;
    }
    players.sort((a, b) => a.name.localeCompare(b.name));
    return player;
}
