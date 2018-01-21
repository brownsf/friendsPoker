// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var cards = require('cards');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var AWS = require("aws-sdk");

AWS.config.loadFromPath('./server/config.json');
AWS.config.update({
  region: "us-west-2",
});
var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});



// Starts the server.
server.listen(5000, function () {
  console.log('Starting server on port 5000');
});
var players = {};
var deck = [];
var game = {}
var addPlayer = (player) => {
  var params = {
    TableName: "users",
    Item: {
      ...player,
      
    }
  }
  docClient.put(params, function (err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
}

io.on('disconnect', function (socket) {
  players[socket.id] = undefined;
  socket.emit('players', Object.keys(players).map(player => players[player].firstName + ' ' + players[player].lastName))
})

io.on('connection', function (socket) {
  var params = {
    TableName: "games",
  }
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      // print all the movies
      console.log("Scan succeeded.");
      socket.emit('view games', data.Items)
      data.Items.forEach(function (game) {
        console.log(game);


      })
    }
  });

  var params = {
    TableName: "users",
  }
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      // print all the movies
      console.log("Scan succeeded.");
      socket.emit('userList', data.Items)
    }
  });


  socket.on('chooseGame', (newGame) => {
    game = newGame
    console.log(game)
    socket.emit('currentGame', game)
  })
  socket.emit('players', Object.keys(players).map(player => players[player].firstName + ' ' + players[player].lastName))
  socket.on('new player', function (player) {
    player = { ...player, id: Date.now(),}
    console.log(player)
    addPlayer(player);
    players[socket.id] = { ...player };
    var playerList = Object.keys(players).map(player => players[player].firstName + ' ' + players[player].lastName)
    console.log('playerList', playerList)
    console.log('players', players)
    socket.emit('joined', playerList)

  });

  socket.on('deal', function () {
    var deck = new cards.PokerDeck();
    deck.shuffleAll();
    Object.keys(players).forEach(playerId => {
      console.log('delt', playerId)
      console.log('game', game)
      var currentHand = deck.draw((game||{}).handCards || 5)
      console.log('hand', currentHand)
      players[playerId].currentHand = currentHand.map(card => ({ suit: card.suit, value: card.value }))
      io.to(playerId).emit('new hand', players[playerId].currentHand);
    })
  });

});
