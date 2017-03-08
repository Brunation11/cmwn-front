import React from 'react';
import _ from 'lodash';

class MockFunctionWrapper extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        this.render = this.props.render.bind(this, this.props.item);

        if (this.props.functions) {
            _.forEach(this.props.functions, (func, funcName) => {
                this[funcName] = func.bind(this);
            });
        }
    }
}

export default MockFunctionWrapper;
