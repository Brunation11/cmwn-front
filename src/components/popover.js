import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Shortid from 'shortid';
import Moment from 'moment';

import 'components/popover.scss';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

var PopOver = React.createClass({
    getInitialState: function () {
        return {
            element: [],
            trigger: 'hover',
            placement: 'bottom'
        };
    },
    componentDidMount: function () {
        this.setState({
            element: this.props.element,
            trigger: this.props.trigger || this.state.trigger,
            placement: this.props.placement || this.state.placement,
            type: this.props.type
        });
    },
    renderFlip: function () {
        var state = this.state;
        return (
            <ButtonToolbar id={Shortid.generate()}>
                <OverlayTrigger
                    trigger={state.trigger}
                    rootClose
                    placement={state.placement}
                    overlay={
                        <Popover
                            id={Shortid.generate()}
                            className="flip-popover"
                            title={[
                                state.element.title,
                                <br />,
                                <span className="title-meta">
                                    {`Earned: ${Moment(state.element.earned).format('MMM Do YYYY')}`}
                                </span>
                            ]}
                        >
                            {state.element.description}
                        </Popover>}>
                        <img src={`/flips/${state.element.flip_id}-earned.gif`} />
                </OverlayTrigger>
            </ButtonToolbar>
        );
    },
    getUserFlips: function () {
        var state = this.state;
        // get users flips and set to state
        HttpManager.GET({
            url: (`${GLOBALS.API_URL}user/${state.element.friend_id}/flip`),
            handleErrors: false
        })
        .then(res => {
            this.setState({flips: res.response});
        });
    },
    renderUser: function () {
        var state = this.state;
        return (
            <ButtonToolbar id={Shortid.generate()}>
                <OverlayTrigger
                    trigger={state.trigger}
                    rootClose
                    placement={state.placement}
                    overlay={(
                        <Popover
                            id={Shortid.generate()}
                            title={`Earned: ${state.flips.length}`}
                        >
                            {state.flips}
                        </Popover>
                    )}
                >
                    {this.props.children}
                </OverlayTrigger>
            </ButtonToolbar>
        );
    },
    render: function () {
        var state = this.state;
        var popover;
        if (state.type === 'flip') {
            popover = this.renderFlip();
        } else if (state.type === 'user') {
            popover = this.renderUser();
        }

        return (
            <div>
                {popover}
            </div>
        );
    }
});

export default PopOver;
