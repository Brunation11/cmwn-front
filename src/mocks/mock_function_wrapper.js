import React from 'react';

class MockFunctionWrapper extends React.Component {
    constructor() {
        super();
    }

    render() {
        return this.props.render.call(this, this.props.item);
    }
}

export default MockFunctionWrapper;
