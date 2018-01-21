import React, { Component } from 'react';
import Select from 'react-select';
import { Col, ControlLabel } from 'react-bootstrap';

class GameChoice extends Component {
    render() {
        return (
            <Col xs={4}>
                <ControlLabel>Choose Game</ControlLabel>
                <Select
                    onChange={this.props.setGame}
                    options={this.props.games}
                    labelKey="name"
                    valueKey="id"
                    value={(this.props.chosenGame || {}).id}
                />
            </Col>
        );
    }
}

export default GameChoice;