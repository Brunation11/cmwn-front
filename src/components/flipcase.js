import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';

import FlipPopover from 'components/popovers/flip_popover';

import 'components/flipcase.scss';

const COPY = {
    HEADER: 'Your Earned Flips: '
};

export default class Flipcase extends React.Component {
    constructor(props) {
        super(props);

        this.state = _.defaults({
            flips: [],
            allFlips: []
        });
    }

    componentDidMount() {
        this.props.onDataReceived([]);
        if (this.props.data) {
            this.setState({flips: this.props.data});
            this.props.onDataReceived(this.props.data);
        }
        if (this.props.allFlips) {
            this.setState({allFlips: this.props.allFlips});
            this.props.onDataReceived(this.props.allFlips);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            if (
                this.props.data == null ||
                nextProps.data.length !== this.props.data.length ||
                nextProps.data[0] !== this.props.data[0]
            ) {
                this.props.onDataReceived(nextProps.data);
            }
            this.setState({flips: nextProps.data});
        }
        if (nextProps.allFlips && nextProps.allFlips) this.setState({allFlips: nextProps.allFlips});
    }

    renderAll() {
        var allFlips = this.state.allFlips;
        var earnedFlip;
        var earnedOn;
        var status;

        return (_.map(allFlips, (flip) => {
            if (this.state.flips) {
                earnedFlip = _.find(this.state.flips, ['flip_id', flip.flip_id]);
                earnedOn = earnedFlip ? earnedFlip.earned : null;
                status = earnedOn ? 'earned' : 'static';
            }

            return (
                <FlipPopover
                    key={Shortid.generate()}
                    element={flip}
                    earnedOn={earnedOn ? earnedOn : null}
                    placement="bottom"
                    type="flip"
                    trigger="click"
                    status={status ? status : 'static'}
                />
            );
        }));
    }

    renderEarned() {
        var flips = _.orderBy(this.state.flips, ['earned'], ['desc']);
        return (_.map(flips, (flip) => {
            return (
                <FlipPopover
                    key={Shortid.generate()}
                    element={flip}
                    placement="bottom"
                    type="flip"
                    trigger="click"
                    status="earned"
                />
            );
        }));
    }

    render() {
        var renderFunction;

        if ((this.props.render === 'all' && _.isEmpty(this.state.allFlips)) ||
            (this.props.render === 'earned' && _.isEmpty(this.state.flips))) {
            return null;
        }

        if (this.props.render === 'all') renderFunction = this.renderAll;
        if (this.props.render === 'earned') renderFunction = this.renderEarned;

        return (
            <div className={ClassNames(
                'flipcase',
                this.props.className,
                this.props.type, {
                    header: this.props.header
                }
            )}>
                <span className="header">
                    {COPY.HEADER}<strong>{this.state.flips.length}</strong>
                </span>
                {renderFunction.call(this)}
            </div>
        );
    }
}

Flipcase.defaultProps = {
    onDataReceived: _.identity
};
