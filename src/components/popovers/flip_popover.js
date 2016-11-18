import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Shortid from 'shortid';
import Moment from 'moment';
import ClassNames from 'classnames';
import IB_IDS from 'components/ib_ids';
import GLOBALS from 'components/globals';

import 'components/popovers/popover.scss';

export default class FlipPopover extends React.Component {
    constructor() {
        super();

        this.state = {
            element: [],
            trigger: 'hover',
            placement: 'bottom',
            status: 'static'
        };
    }

    componentDidMount() {
        this.setState({
            element: this.props.element,
            earnedOn: this.props.element.earned || this.props.earnedOn,
            trigger: this.props.trigger || this.state.trigger,
            placement: this.props.placement || this.state.placement,
            status: this.props.status || this.state.status
        });

        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        var id = this.state.element.flip_id;
        var flip = IB_IDS.FLIPS[id] ? IB_IDS.FLIPS[id][this.state.status] : IB_IDS.FLIPS.default;
        var src = `${GLOBALS.MEDIA_URL}${flip}`;

        if (!this._mounted) {
            return null;
        }

        return (
            <div className={ClassNames('single-flip', {hidden: this.state.error})}>
                <ButtonToolbar id={Shortid.generate()}>
                    <OverlayTrigger
                        trigger={this.state.trigger}
                        rootClose
                        placement={this.state.placement}
                        overlay={
                            <Popover
                                id={Shortid.generate()}
                                className="flip-popover"
                                title={[
                                    this.state.element.title,
                                    <br />,
                                    <span className={ClassNames(
                                        'title-meta', {
                                            hidden: !this.state.earnedOn
                                        }
                                    )}>
                                        {`Earned: ${Moment(this.state.earnedOn).format('MMM Do YYYY')}`}
                                    </span>
                                ]}
                            >
                                {this.state.element.description}
                            </Popover>}>
                            <img src={src} />
                    </OverlayTrigger>
                </ButtonToolbar>
            </div>
        );
    }
}
