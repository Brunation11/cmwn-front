import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Panel} from 'react-bootstrap';

import FlipPopover from 'components/popovers/flip_popover';

import 'components/flipcase.scss';

const HEADINGS = {
    POPOVER_SELF: 'Your Earned Flips: ',
    POPOVER_OTHER: '\'s Earned Flips: ',
    TROPHYCASE: 'Trophycase'
};

export default class Flipcase extends React.Component {
    constructor() {
        super();

        this.state = _.defaults({
            flips: []
        });
    }

    componentDidMount() {
        if (this.props.data) this.setState({flips: this.props.data});
        if (this.props.allFlips) this.setState({allFlips: this.props.allFlips});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data) this.setState({flips: nextProps.data});
        if (nextProps.allFlips && nextProps.allFlips) this.setState({allFlips: nextProps.allFlips});
    }

    renderAll() {
        var allFlips = _.shuffle(this.state.allFlips);
        return (_.map(allFlips, (flip) => {
            var earnedFlip = _.find(this.state.flips, ['flip_id', flip.flip_id]);
            var earnedOn = earnedFlip ? earnedFlip.earned : null;
            var status = earnedOn ? 'earned' : 'unearned';

            return (
                <FlipPopover
                    element={flip}
                    earnedOn={earnedOn}
                    placement="bottom"
                    type="flip"
                    trigger="click"
                    status={status}
                />
            );
        }));
    }

    renderEarned() {
        var earnedFlips = _.shuffle(this.state.flips);
        return (_.map(earnedFlips, (flip) => {
            return (
                <FlipPopover
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
        var popover = HEADINGS.POPOVER_SELF;

        if (this.props.data == null || !this.props.data.length) return null;

        if (this.props.render === 'all' && this.state.allFlips) renderFunction = this.renderAll;
        if (this.props.render === 'earned' && this.state.flips) renderFunction = this.renderEarned;

        if (typeof this.props.user === 'string') {
            popover = `${this.props.user}${HEADINGS.POPOVER_OTHER}`;
        }

        return (
            <Panel
                header={HEADINGS.TROPHYCASE}
                className={ClassNames(
                    'flipcase',
                    'standard',
                    this.props.classNames,
                    this.props.type,
                    {
                        header: this.props.header
                    }
                )}
            >
                <span className="header">
                    {popover}<strong>{this.state.flips.length}</strong>
                </span>
                {renderFunction.call(this)}
            </Panel>
        );
    }
}

