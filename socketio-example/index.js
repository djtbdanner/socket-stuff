const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

httpServer = http.createServer((req, res) => {
  console.log(`created test server ${req}`);
  fs.readFile(__dirname + "\\index.html", function (err, file) {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(file);
  });
});

const io = socketio(httpServer);

/// Every time a client connects a new socket with unique id is created
io.sockets.on(`connect`, (socket) => {
  console.log(`io connection, id: ${socket.id}`);
  
  socket.on('io-message', (data) => {
    console.log(`io-message  ${data}`);
    socket.emit(`io-message`, data);
  });

  socket.on('io-message-everyone', (data) => {
    console.log(`io-message-everyone  ${data}`);
    io.emit(`io-message`, data);
  });

  
  socket.on('io-message-everyone-else', (data) => {
    console.log(`io-message-everyone-else  ${data}`);
    socket.broadcast.emit(`io-message`, data);
  });

});

httpServer.listen(8080, () => {
  console.log(`listing on port 8080`)
});
