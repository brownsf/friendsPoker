// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const cards = require('cards');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./server/config.json');
AWS.config.update({
  region: 'us-west-2',
});
const docClient = new AWS.DynamoDB.DocumentClient();

app.set('port', 8080);
app.use('/', express.static(`${__dirname}/../client/build`));
// Routing
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Starts the server.
server.listen(8080, () => {
  console.log('Starting server on port 5000');
});
const players = {};
let deck = [];
let game = {};
const addPlayer = (player) => {
  const params = {
    TableName: 'users',
    Item: {
      ...player,
    },
  };
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
};

io.on('disconnect', (socket) => {
  players[socket.id] = undefined;
  socket.emit(
    'players',
    Object.keys(players).map(player => `${players[player].firstName} ${players[player].lastName}`),
  );
});

io.on('connection', (socket) => {
  let params = {
    TableName: 'games',
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      // print all the movies
      socket.emit('view games', data.Items);
    }
  });

  params = {
    TableName: 'users',
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      // print all the movies
      socket.emit('userList', data.Items);
    }
  });

  socket.on('chooseGame', (newGame) => {
    game = newGame;
    console.log(game);
    socket.emit('currentGame', game);
  });
  socket.emit(
    'players',
    Object.keys(players).map(player => `${players[player].firstName} ${players[player].lastName}`),
  );
  socket.on('new player', (player) => {
    player = { ...player, id: Date.now() };
    addPlayer(player);
    players[socket.id] = { ...player };
    const playerList = Object.keys(players).map(player => `${players[player].firstName} ${players[player].lastName}`);
    socket.emit('joined', playerList);
  });

  socket.on('choosePlayer', (player) => {
    const playerParams = {
      TableName: 'users',
      Key: {
        id: player,
      },
    };
    docClient.get(playerParams, (err, newPlayer) => {
      if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        players[socket.id] = { ...newPlayer.Item };
        const playerList = Object.keys(players).map(play => `${players[play].firstName} ${players[play].lastName}`);
        socket.emit('joined', playerList);
      }
    });
  });

  socket.on('deal', () => {
    deck = new cards.PokerDeck();
    deck.shuffleAll();
    Object.keys(players).forEach((playerId) => {
      const currentHand = deck.draw((game || {}).handCards || 5);
      players[playerId].currentHand = currentHand.map(card => ({
        suit: card.suit,
        value: card.value,
      }));
      io.to(playerId).emit('new hand', players[playerId].currentHand);
    });
  });
});
