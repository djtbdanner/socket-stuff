let socket = io.connect(window.location.href);

// from server when a player is added to automatically update the list of players
socket.on('players-updated', (data) => {
    console.log(JSON.stringify(data.players));
    if (document.getElementById(`player-list-exist`))
        createAndAppendDiv(buildPlayerList(data.players), `game-div`);
});

// async function gameRestart(data) {
//     start = performance.now();
//     const dataResponse = await asyncEmit(`game-restart`, data);
//     const duration = performance.now() - start;
//     alert(dataResponse + ` in ${duration}`);
// }

// player selects a game
async function initGame(otherPlayerId){
    const game = await asyncEmit('init-game', otherPlayerId);
    createAndAppendDiv(buildTicTacToeHtml(), `game-div`);
}
socket.on('init-game-other', (data) => {
    alert()
    createAndAppendDiv(buildTicTacToeHtml(), `game-div`);
});

async function addPlayer() {
    try {
        const player = {};
        const name = document.getElementById(`name`).value;
        player.name = name;
        const data = await asyncEmit(`add-player`, player);
        const socketId = data.player.socketId;
        // localStorage.setItem('thisPlayerSocketId', socketId);
        document.getElementById(`myid`).value = socketId;

        createAndAppendDiv(buildPlayerList(data.players),`game-div`);
    } catch (e) {
        timeoutOrOtherError(e);
    }
}



// asynch emit - on server side just respond to call with same name emit
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

// local error
function timeoutOrOtherError(e) {
    const message = `It seems like your connection is not very good. Will keep trying to connect, but may impact play.`
    console.error(e);
    alert(message);
}

// backend error (as long as sockets still connected)
socket.on('backendError', (data) => {
    alert(JSON.stringify(data));
});
