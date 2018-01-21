import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

const newHand = (cb) => {
  socket.on('new hand', (hand) => {
    cb(hand);
  });
};
const newPlayer = (player) => {
  socket.emit('new player', player);
};
const dealCards = () => {
  socket.emit('deal');
const gamesList = (cb) => {
  socket.on('view games', list => cb(list));
};
const playerJoined = (cb) => {
  socket.on('joined', list => cb(list));
  socket.on('players', list => cb(list));
};
const getUsers = (cb) => {
  socket.on('userList', list => cb(list));
};
const chooseGame = (game) => {
  socket.emit('chooseGame', game);
};
export { newPlayer, dealCards, newHand, playerJoined, gamesList, chooseGame, getUsers };
