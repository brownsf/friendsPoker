import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component {
    render() {
        return (
            <div style={{padding:'5px'}}>
                <img style={{ maxWidth: '100%' }} src={this.props.image} />
            </div>
        );
    }
}

Card.propTypes = {

};

export default Card;