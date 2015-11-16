import React from 'react';

import {Panel} from 'react-bootstrap';

import 'components/flipboard.scss';

var FlipBoard = React.createClass({
    getDefaultProps: function () {
        return {
            header: 'Flipboard',
            data: [],
            renderFlip: () => <div className="flip"></div>
        };
    },
    render: function () {
        return (<div className="flipboard">
            <Panel header={this.props.header} className="standard">
                {_.map(this.props.data, item => this.props.renderFlip(item))}
            </Panel>
        </div>);
    }
});

export default FlipBoard;
