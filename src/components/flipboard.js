import React from 'react';
import _ from 'lodash';
import Shortid from 'shortid';

import {Panel} from 'react-bootstrap';

import 'components/flipboard.scss';

var FlipBoard = React.createClass({
    getInitialState: function () {
        return {
            data: _.map(this.props.data == null ? [] : this.props.data, this.props.transform)
        };
    },
    getDefaultProps: function () {
        return {
            header: 'Flipboard',
            transform: _.identity,
            renderFlip: () => <div className="flip" key={Shortid.generate()}></div>
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            data: _.map(nextProps.data == null ? [] : nextProps.data, this.props.transform)
        });
    },
    render: function () {
        if (!this.state.data.length) {
            return null;
        }
        return (
            <div className="flipboard">
                <Panel header={this.props.header} className="standard">
                    {_.map(this.state.data, (item, i) => this.props.renderFlip(item, i))}
                </Panel>
            </div>
        );
    }
});

export default FlipBoard;
