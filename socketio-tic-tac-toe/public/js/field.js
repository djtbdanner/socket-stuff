function buildTicTacToeHtml(game) {
    const thisPlayerSocketId = document.getElementById(`myid`).value;
    const otherPlayer = game.players.find(p => p.socketId !== thisPlayerSocketId);
    const thisPlayer = game.players.find(p => p.socketId === thisPlayerSocketId);

    let html = ``;
    html += `<section>`;
    html += `<h1 class="game-title">Tic Tac Toe</h1>`;
    html += `<div class="game-container">`;
    for (let i = 0; i < 9; i++) {
        html += `    <div id="${i}" class="cell" onclick = ${thisPlayer.turn ? "selectCell(this)" : "otherPlayersTurn(this)"}>${game.board[i]}</div>`;
    }
    html += `</div>`;
    let dispTurn = true;
    if (game.draw) {
        html += `<p class = "game-status">DRAW</p>`;
        html += `<button class="game-button" onclick="initGame('${otherPlayer.socketId}')"">Restart Game!</button>`;
        dispTurn = false;
    }
    if (game.winner) {
        if (game.winner.socketId === thisPlayerSocketId) {
            html += `<p class = "game-status">YOU WIN! &#128526; <p/>`
        } else {
            html += `<p class = "game-status">${game.winner.name} WINS! &#x1F614;<p/>`;
        }
        html += `<br/><button class="game-button" onclick="initGame('${otherPlayer.socketId}')"">Play Again</button>`;
        dispTurn = false;
    }

    if (dispTurn) {
        if (thisPlayer.turn) {
            html += `<p class = "game-status"> Your turn (as ${thisPlayer.symbol})<p/>`;
        } else {
            let otherPlayerName = otherPlayer.name;
            if (otherPlayerName.endsWith(`s`)) {
                otherPlayerName += `'`;
            } else {
                otherPlayerName += `'s`;
            }
            html += `<br/><p class = "game-status" id = "op-name">${otherPlayerName} turn</p><br/>`;
        }
    }
    html += `</section>`;
    return html;
}

function selectCell(element) {
    let fieldId = element.id;
    makePlay(fieldId);
}

function otherPlayersTurn(element) {
    document.getElementById(`op-name`).classList.add(`twoColor`);
}

function buildNameEntry() {
    let html = ``;
    html += `<script>alert("hi");</script>`;
    html += `<section>`;
    html += `<h1 class="game-title">Tic Tac Toe</h1>`;
    html += ` NAME: <input class="game-txt" type=txt id="name" autofocus/><br/><br/>`
    html += `<button class="game-button" onclick="addPlayer()">Find player</button>`;
    html += `</section>`;
    return html;
}

function buildPlayerList(players) {
    const thisPlayerSocketId = document.getElementById(`myid`).value;
    let html = ``;
    html += `<section id = "player-list">`;
    html += `<h1 class="game-title">Tic Tac Toe</h1>`;
    const thisPlayer = players.find((p) => p.socketId === thisPlayerSocketId);
    if (thisPlayer) {
        html += `<h1> Welcome ${thisPlayer.name}</h1>`
    }

    let playerListHtml = ``;
    players.forEach((player) => {
        if (player.socketId !== thisPlayerSocketId) {
            playerListHtml += `<li> <a href="#" onclick = "initGame('${player.socketId}')">${player.name}</a></li>`;
        }
    });
    if (playerListHtml.length > 2) {
        html += `<p>Select a player to start game</\p>`
        html += `<ul>`
        html += playerListHtml;
    } else {
        html += `<br/><p> No other players at this time.</p>`
    }
    html += `</section>`;
    return html;
}

function createAndAppendDiv(html, id) {
    let div = document.getElementById(id);
    if (div) {
        destroyNode(div);
        div = undefined;
    }
    if (!div) {
        div = document.createElement(`div`);
        div.id = id;
    }
    div.innerHTML = html;
    document.body.appendChild(div);
}

function destroyNode(node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
