import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, } from 'react-bootstrap';
import CurrentHand from './CurrentHand';
import GameChoice from './GameChoice';

class Game extends Component {
    render() {
        function importAll(r) {
            let images = {};
            r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
            return images;
        }

        const images = importAll(require.context('../cardImages', false, /\.(png|jpe?g|svg)$/));

        return (
            <div>
                <Row>
                    <GameChoice chosenGame={this.props.chosenGame} setGame={this.props.setGame} games={this.props.allGames} />
                </Row>
                <Row>
                    <Button onClick={this.props.deal}>Deal</Button>
                </Row>
                {this.props.hand &&
                    <CurrentHand images={images} hand={this.props.hand} />
                }
            </div>
        );
    }
}

Game.propTypes = {

};

export default Game;