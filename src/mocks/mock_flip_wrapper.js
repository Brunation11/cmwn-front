import React from 'react';

import { Profile } from 'routes/users/profile';

class MockFlipWrapper extends React.Component {

    showModal(gameUrl) {
        this.props.clicked = gameUrl;
    }

    render() {
        return Profile.prototype.renderFlip.call(this, this.props.item);
    }
}

MockFlipWrapper.defaultProps = {clicked: null};

export default MockFlipWrapper;
