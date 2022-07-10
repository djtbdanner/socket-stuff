const http = require('http');
const WebSocketServer = require("websocket").server;
let connection = null;

httpServer = http.createServer((req, res) => {
    console.log(`created test server ${req}`);
    res.writeHead(200);
    res.end("<h1>hello world</h1>");
});

// create websocket server from http server = JSON passed http server
// underneath it has the httpserver 
const websocket = new WebSocketServer({"httpServer": httpServer});

websocket.on("request", request => {
    console.log(`connection created `);
    connection = request.accept(null, request.origin);
    connection.on("close", () => console.log(`Closed-`));
    connection.on("message", message => {
        console.log(`Received client message: ${message.utf8Data}`);
        connection.send(`got your message: ${message.utf8Data}`)
    });
    repeatMessage();
});

function repeatMessage(){
    const messageToClient = `Server time: ${new Date()}`;
    connection.send(messageToClient);
    console.log(messageToClient);
    setTimeout(repeatMessage, 5000);
}

httpServer.listen(8080, () =>{
    console.log(`listing on port 8080`)
});
//client code 
//let ws = new WebSocket("ws://localhost:8080");
//ws.send("Hello! I'm client")
//ws.onmessage = (message) => {console.log(`message received`, message.data)}