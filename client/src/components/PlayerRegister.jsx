import React, { Component } from 'react';
import { Row, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class PlayerRegister extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }
  save() {
    const player = { firstName: this.firstName.value, lastName: this.lastName.value };
    this.props.savePlayer(player);
  }
  render() {
    return (
      <form>
        <Row>
          <Col lg={3} md={4} xs={12}>
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              type="text"
              placeholder="First Name"
              inputRef={(input) => {
                this.firstName = input;
              }}
            />
          </Col>
          <Col lg={3} md={4} xs={12}>
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              type="text"
              placeholder="Last Name"
              inputRef={(input) => {
                this.lastName = input;
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Button onClick={this.save} bsStyle="primary">
              Save
            </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default PlayerRegister;
