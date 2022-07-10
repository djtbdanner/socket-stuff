const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const content = "/public";
const allowedFiles = findFilesInPublicForSecurity(content);
const port = 8080;

httpServer = http.createServer(function (req, res) {
    let url = req.url;
    if (!allowedFiles.includes(url)) {
        res.writeHead(404);
        res.end(JSON.stringify({ notfound: url }));
        return;
    }

    if (url === "/" || url === "") {
        url = "/index.html"
    }


    // do the file read and return to caller
    fs.readFile(__dirname + content + url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.setHeader("Content-Type", getMimeType(url));
        res.writeHead(200);
        res.end(data);
    });
});


// const io = socketio(httpServer);

httpServer.listen(8080, () => {
    console.log(`listing on port 8080`)
});

function getMimeType(url) {
    let mimeType = "text/html";
    if (url && url.toUpperCase().endsWith("JS")) {
        mimeType = "text/javascript";
    }
    if (url && url.toUpperCase().endsWith("CSS")) {
        mimeType = "text/css";
    }
    if (url && url.toUpperCase().endsWith("MP3")) {
        mimeType = "audio/mp3";
    }
    if (url && url.toUpperCase().endsWith("PNG")) {
        mimeType = "image/png";
    }
    return mimeType;
}

function findFilesInPublicForSecurity(contentFolder) {
    const dirs = fs.readdirSync(__dirname + contentFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    let allowedFiles = ["/", ""];
    dirs.forEach((dir) => {
        const x = fs.readdirSync(__dirname + `${contentFolder}/${dir}`, { withFileTypes: true })
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => `/${dir}/${dirent.name}`);
        allowedFiles = allowedFiles.concat(x);
    });

    const files = fs.readdirSync(__dirname + contentFolder, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory())
        .map(dirent => `/${dirent.name}`);
    allowedFiles = allowedFiles.concat(files);

    console.log(allowedFiles);
    return allowedFiles;
}

// give others access to the server
module.exports = {
    httpServer
  }