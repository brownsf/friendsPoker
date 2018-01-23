import openSocket from 'socket.io-client';

const host = process.env.NODE_ENV === 'production' ? 'friends-poker.appspot.com' : 'localhost:8080';
const socket = openSocket(`http://${host}`);

export const newHand = (cb) => {
  socket.on('new hand', (hand) => {
    cb(hand);
  });
};
export const newPlayer = (player) => {
  socket.emit('new player', player);
};
export const dealCards = () => {
  socket.emit('deal');
};
export const gamesList = (cb) => {
  socket.on('view games', list => cb(list));
};
export const playerJoined = (cb) => {
  socket.on('joined', list => cb(list));
  socket.on('players', list => cb(list));
};
export const getUsers = (cb) => {
  socket.on('userList', list => cb(list));
};
export const chooseUser = (player) => {
  socket.emit('choosePlayer', player);
};
export const chooseGame = (game) => {
  socket.emit('chooseGame', game);
};
