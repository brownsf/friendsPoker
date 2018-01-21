import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import PlayerRegister from './PlayerRegister';
import { Row, Col, ControlLabel } from 'react-bootstrap';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Row style={{ marginBottom: '15px' }}>
          <Col xs={6} md={3}>
            <ControlLabel>Current Players</ControlLabel>
            <Select
              onChange={(val) => {
                this.props.setPlayer((val || {}).user);
                if ((val || {}).value) this.props.chooseUser(val.value);
              }}
              options={this.props.users.map(user => ({
                user,
                value: user.id,
                label: `${user.firstName} ${user.lastName}`,
              }))}
              value={this.props.currentPlayer}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ControlLabel>New Player</ControlLabel>
            <PlayerRegister savePlayer={this.props.savePlayer} />
          </Col>
        </Row>
      </div>
    );
  }
}

UserForm.defaultProps = {
  users: [],
};

UserForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  savePlayer: PropTypes.func.isRequired,
  setPlayer: PropTypes.func.isRequired,
};
export default UserForm;
