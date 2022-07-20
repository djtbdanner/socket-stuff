let socket = io.connect(window.location.href);

// from server when a player is added to automatically update the list of players
socket.on('players-updated', (data) => {
    console.log(JSON.stringify(data.players));
    if (document.getElementById(`player-list`))
        createAndAppendDiv(buildPlayerList(data.players), `game-div`);
});

async function initGame(otherPlayerId) {
    const game = await asyncEmit('init-game', otherPlayerId);
    createAndAppendDiv(buildTicTacToeHtml(game), `game-div`);
}

socket.on('init-game-other', (data) => {
    const game = data;
    createAndAppendDiv(buildTicTacToeHtml(game), `game-div`);
});

async function addPlayer() {
    try {
        const player = {};
        const name = document.getElementById(`name`).value;
        player.name = name;
        const data = await asyncEmit(`add-player`, player);
        const socketId = data.player.socketId;
        document.getElementById(`myid`).value = socketId;
        createAndAppendDiv(buildPlayerList(data.players), `game-div`);
    } catch (e) {
        timeoutOrOtherError(e);
    }
}

async function makePlay(fieldId) {
    const game = await asyncEmit(`make-play`, fieldId);
    createAndAppendDiv(buildTicTacToeHtml(game), `game-div`);
}
socket.on('make-play-other', (data) => {
    const game = data;
    createAndAppendDiv(buildTicTacToeHtml(game), `game-div`);
});

// async emit - on server side just respond to call with same name emit
function asyncEmit(eventName, data) {
    return new Promise(function (resolve, reject) {
        socket.emit(eventName, data);
        socket.on(eventName, result => {
            socket.off(eventName);
            resolve(result);
        });
        setTimeout(reject, 15000); /// in millis
    });
}

function timeoutOrOtherError(e) {
    const message = `It seems like your connection is not very good. Will keep trying to connect, but may impact play.`
    console.error(e);
    alert(message);
}

socket.on('backendError', (data) => {
    alert(JSON.stringify(data));
});
