const socketio = require('socket.io');
const Player = require('./classes/player');
const Game = require('./classes/game');
const httpServer = require('../server').httpServer;
const io = socketio(httpServer);
// this could be a database
const gamesTable = [];
const playersTable = [];

io.sockets.on(`connect`, (socket) => {
    console.log(`io connection, id: ${socket.id}`);

    /*
    * Player signs in with name and waits for play
    */
    socket.on('add-player', function (data) {
        try {
            console.log(`add-player: ${JSON.stringify(data)}`);
            const playerName = data.name || "name";
            const player = addPlayertoPlayers(socket, playerName);
            socket.emit('add-player', {player, players: getPlayersToPlay()});
            socket.broadcast.emit(`players-updated`, {players: getPlayersToPlay()});
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    /*
    * Player chooses another player from list for new game or requests a repeat game
    */
    socket.on('init-game', function (data) {
        try {
            console.log(`init-game: ${JSON.stringify(data)}`);
            const otherPlayerId = data;
            const player = playersTable.find((p) => p.socketId === socket.id);
            const otherPlayer = playersTable.find((p) => p.socketId === otherPlayerId);
            player.playerStatus = Player.IN_GAME;
            otherPlayer.playerStatus = Player.IN_GAME;
            player.symbol = `X`;
            player.turn = true;
            otherPlayer.symbol = `O`;
            otherPlayer.turn = false;
            let game = getGameBySocket(socket);
            if (game) {
                game.player1 = player;
                game.player2 = otherPlayer;
            }
            if (!game) {
                game = new Game(player, otherPlayer);
                gamesTable.push(game);
            }
            game.reset();
            socket.emit('init-game', game);
            socket.to(otherPlayerId).emit('init-game-other', game);
            socket.broadcast.emit(`players-updated`, {players: getPlayersToPlay()});
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    /*
    * Play is made on the board - winner or draw decided here
    */
    socket.on('make-play', function (data) {
        try {
            console.log(`make-play: ${JSON.stringify(data)}`)
            const fieldId = data;
            let game = getGameBySocket(socket);
            const player = game.players.find((p) => p.socketId === socket.id);
            player.turn = false;
            const otherPlayer = game.players.find((p) => p.socketId !== socket.id);
            otherPlayer.turn = true;
            game.board[fieldId] = player.symbol;

            const winner = playerWins(player.symbol, game.board);
            if (winner) {
                game.winner = player;
            }
            if (!winner && isDraw(game.board)) {
                game.draw = true;
            }
            socket.emit('make-play', game);
            socket.to(otherPlayer.socketId).emit('make-play-other', game);

        } catch (error) {
            handleError(socket, error, data);
        }
    });

    /*
    * Socket disconnects player no longer playing or waiting for a game.
    */
    socket.on('disconnect', function (data) {
        try {
            console.log(`socket ${socket.id} disconnected`);
            if (gamesTable.length > 0) {
                let game = getGameBySocket(socket);
                if (game) {
                    const otherPlayer = game.players.find((p) => p.socketId !== socket.id);
                    const leavingPlayer = game.players.find((p) => p.socketId === socket.id);
                    otherPlayer.turn = false;
                    otherPlayer.playerStatus = otherPlayer.IN_POOL;
                    const leftOverGames = gamesTable.filter(g => g.id !== game.id);
                    gamesTable.splice(0);
                    gamesTable.push(...leftOverGames);
                    socket.to(otherPlayer.socketId).emit('other-player-dropped', {players: getPlayersToPlay(), leavingPlayer});
                }
            }
            if (playersTable.length > 0) {
                const leftoverPlayers = playersTable.filter(p => p.socketId !== socket.id);
                playersTable.splice(0);
                playersTable.push(...leftoverPlayers);
                socket.broadcast.emit(`players-updated`, {players: getPlayersToPlay()});
            }
        } catch (error) {
            handleError(socket, error, data);
        }
    });
});

function getPlayersToPlay() {
    const playersToPlay = playersTable.filter((p) => p.playerStatus === p.IN_POOL);
    playersToPlay.sort((a, b) => a.name.localeCompare(b.name));
    return playersToPlay;
}

function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        let errorMessage = `There was an error in processing.`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {
        console.log(e);
    }
}

function addPlayertoPlayers(socket, playerName) {
    let player = playersTable.find((p) => {
        return p.socketId === socket.id;
    });
    if (!player) {
        player = new Player(playerName, socket.id);
        playersTable.push(player);
    }
    if (playerName && player.name !== playerName) {
        console.log(`Replacing player name ${player.name} with ${playerName}`);
        player.name = playerName;
    }
    playersTable.sort((a, b) => a.name.localeCompare(b.name));
    return player;
}

function playerWins(playerSymbol, board) {
    const winningIndexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8,]];
    for (let i = 0; i < winningIndexes.length; i++) {
        if (board[winningIndexes[i][0]] === playerSymbol && board[winningIndexes[i][1]] === playerSymbol && board[winningIndexes[i][2]] === playerSymbol) {
            return true;
        }
    }
    return false;
}

function isDraw(board) {
    const emptySquares = board.filter(b => b === ``);
    return emptySquares.length === 0;
}

function getGameBySocket(socket) {
    let game = gamesTable.find((g) => g.player1.socketId === socket.id);
    if (!game) {
        game = gamesTable.find((g) => g.player2.socketId === socket.id);
    }
    return game;
}
