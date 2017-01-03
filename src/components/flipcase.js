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
    constructor() {
        super();

        this.state = _.defaults({
            flips: [],
            allFlips: []
        });
    }

    componentDidMount() {
        if (this.props.data) this.setState({flips: this.props.data});
        if (this.props.allFlips) this.setState({allFlips: this.props.allFlips});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && this.props.data !== nextProps.data) {
            this.setState({
                flips: nextProps.data
            });
        }
        if (nextProps.allFlips && this.props.allFlips !== nextProps.allFlips) {
            this.setState({
                allFlips: nextProps.allFlips
            });
        }
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
        return (_.map(this.state.flips, (flip) => {
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
