import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import PlayerRegister from './PlayerRegister';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Select
          options={this.props.users.map(user => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
          }))}
        />

        <PlayerRegister savePlayer={this.props.savePlayer} />
      </div>
    );
  }
}

UserForm.defaultProps = {
  users: [],
};

UserForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};
export default UserForm;
