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
    componentDidMount(){
        if (this.props.data) this.setState({ data: _.map(this.props.data, this.props.transform)});
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.data, nextProps.data)) {
            this.setState({
                data: _.map(nextProps.data, this.props.transform)
            }, () => { this.props.updateParent(this.state.data); });
        } else if (this.props.alwaysUpdateParent) {
            this.props.updateParent(this.state.data);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.data.length > 0 && this.state.data !== prevState.data) {
            this.props.onLoad();
        }
    }
    render() {
        if (!this.state.data.length) {
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
    onLoad: _.noop,
    renderNoData: () => null,
    renderFlip: () => <div className="flip" key={Shortid.generate()}></div>,
    updateParent: _.noop,
};

export default FlipBoard;
