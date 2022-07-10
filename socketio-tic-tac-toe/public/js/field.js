function buildTicTacToeHtml() {
    let html = ``;
    html += `<section>`;
    html += `<h1 class="game--title">Tic Tac Toe</h1>`;
    html += `<div class="game--container">`;
    for (let i = 1; i < 10; i++) {
        html += `    <div id="${i}" class="cell" onclick = "selectCell(this)">d</div>`;
    }
    html += `</div>`;
    html += `<h2 class="game--status"></h2>`;
    html += `<button class="game--restart" onclick="gameRestart('hello')">Restart Game!</button>`;
    html += `</section>`;
    return html;
}

function selectCell(element) {
    element.innerHTML = `X`;
}


function buildNameEntry() {
    let html = ``;
    html += `<section>`;
    html += ` NAME: <input class="input--txt" type=txt id="name"/>`
    html += `<h2 class="game--status"></h2>`;
    html += `<button class="game--restart" onclick="addPlayer()">Add Me</button>`;
    html += `</section>`;
    return html;
}

function buildPlayerList(players) {
    // const thisPlayerSocketId = localStorage.getItem('thisPlayerSocketId');
    const thisPlayerSocketId = document.getElementById(`myid`).value;
    let html = ``;
    html += `<section id = "player-list-exist">`;
    const thisPlayer = players.find((p) => p.socketId === thisPlayerSocketId);
    if (thisPlayer){
        html += `<h1> Welcome ${thisPlayer.name}</h1>`
    }
    
    let playerListHtml = ``;
    players.forEach((player) => {
        if (player.socketId !== thisPlayerSocketId) {
            playerListHtml += `<li> <a href="#" onclick = "initGame('${player.socketId}')">${player.name}</a></li>`;
        }
    });
    html += `<ul>`
    html += playerListHtml;
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

function destroyAllDivs() {
    const divs = document.getElementsByTagName(`div`);
    divs.forEach((div) => {
        destroyNode(div);
    });
}