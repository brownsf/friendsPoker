import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import './App.css';
import {
  newPlayer,
  dealCards,
  newHand,
  playerJoined,
  gamesList,
  chooseGame,
  getUsers,
} from './socket';
import UserForm from './components/UserForm';
import Game from './components/Game';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.savePlayer = this.savePlayer.bind(this);
    this.setGame = this.setGame.bind(this);
    newHand((hand) => {
      console.log({ hand });
      this.setState({ player: { ...(this.state.player || {}), hand } });
    });
    playerJoined((playerList) => {
      this.setState({ currentPlayers: playerList });
    });
    gamesList((allGames) => {
      this.setState({ allGames });
    });
    getUsers((allUsers) => {
      this.setState({ allUsers });
    });
  }
  setGame(game) {
    this.setState({ chosenGame: game });
    chooseGame(game);
  }
  savePlayer(player) {
    console.log('app', { player });
    this.setState({ player });
    newPlayer(player);
  }
  render() {
    console.log(this.state);
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <header style={{ height: 'auto' }} className="App-header">
              <h1>Playing</h1>
              {(this.state.currentPlayers || []).map(name => (
                <p style={{ color: '#fff' }} key={name}>
                  {name}
                </p>
              ))}
            </header>
          </Col>
        </Row>
        {!this.state.player && (
          <UserForm users={this.state.allUsers} savePlayer={this.savePlayer} />
        )}
        {this.state.player && (
          <Game
            deal={dealCards}
            hand={this.state.player.hand}
            allGames={this.state.allGames}
            setGame={this.setGame}
            board={this.state.board}
            chosenGame={this.state.chosenGame}
          />
        )}
      </Grid>
    );
  }
}

export default App;
