import React from 'react';
import _ from 'lodash';
import Shortid from 'shortid';

import {Panel} from 'react-bootstrap';

import 'components/flipboard.scss';

class FlipBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: _.map((this.props.data === null ||
                this.props.data === []) ? null : this.props.data, this.props.transform)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: _.map((nextProps.data === null ||
                nextProps.data === []) ? null : nextProps.data, this.props.transform)
        });
    }

    render() {
        if (this.state.data == null) {
            return this.props.renderNoData();
        }
        return (
            <div className="flipboard">
                <Panel header={this.props.header} className="standard">
                    {_.map(this.state.data, (item, i) => this.props.renderFlip(item, i))}
                </Panel>
            </div>
        );
    }
}

FlipBoard.defaultProps = {
    header: 'Flipboard',
    transform: _.identity,
    renderNoData: () => null,
    renderFlip: () => <div className="flip" key={Shortid.generate()}></div>
};

export default FlipBoard;
