// Servidor: app.js
// Iniciando servidor HTTP
var app = require('http').createServer(index),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    agent = require('./agent.js');

app.listen(3000, function() {
  console.log("Servidor rodando!");
});

function index(req, res){
  fs.readFile(__dirname + '/index.html', function(err, data){
      res.writeHead(200);
    res.end(data);
  });
}

// Iniciando Socket.IO
var color = '';
// Evento connection ocorre quando entra um novo usuário.
io.on('connection', function(socket){
  socket.on('color', function (cor) {
    color = cor;
  });
  if(color !== '') {
    color = agent.defineColor(color);
  }
  socket.emit('result', color.myColor, color.dadColor, color.momColor);
  socket.emit('genetic', color.geracoes);
});