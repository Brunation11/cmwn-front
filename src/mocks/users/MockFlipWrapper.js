import React from 'react';
import { Profile } from 'routes/users/profile';

export default class MockFlipWrapper extends React.Component {
    
    showModal(gameUrl) {
        return gameUrl;
    }
    
    render() {
        return Profile.prototype.renderFlip(this.props.item);
    }
}