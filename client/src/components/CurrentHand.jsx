import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

class CurrentHand extends Component {
    render() {
        console.log(this.props)
        return (
            <div style={{display: 'flex'}}>
                {this.props.hand.map(card => {
                    console.log(`${card.value}_${card.suit}.png`.toLowerCase())    
                    return <Card image={this.props.images[`${card.value}_${card.suit}.png`.toLowerCase()]} {...card} key={JSON.stringify(card)} />})}
            </div>
        );
    }
}

CurrentHand.propTypes = {

};

export default CurrentHand;