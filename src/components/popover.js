import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import Moment from 'moment';
import _ from 'lodash';

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
            <ButtonToolbar>
                <OverlayTrigger
                    trigger={state.trigger}
                    rootClose
                    placement={state.placement}
                    overlay={
                        <Popover id={Shortid.generate()} title={state.element.title + '  |  earned: ' + Moment(state.element.earned).format('MMM Do YYYY')}>{state.element.description}
                        </Popover>}>
                    <Link to="" key={Shortid.generate()}>
                        <img src={`/flips/${state.element.flip_id}.png`} ></img>
                    </Link>
                </OverlayTrigger>
            </ButtonToolbar>
        );
    },
    getUserFlips: function () {
        var state = this.state;
        // get users flips and set to state
        HttpManager.GET({
            url: (GLOBALS.API_URL + 'user/' + state.element.friend_id + '/flip'),
            handleErrors: false
        })
        .then(res => {
            this.setState({flips: res.response});
        });
    },
    renderUser: function () {
        var state = this.state;
        // check if flips have been set in state (http succeeded), and if there are any flips to display.
        // render popover only if state contains flips
        // if (state.flip && state.flip.length > 0) {
        return (
            <ButtonToolbar>
                <OverlayTrigger
                    trigger={state.trigger}
                    rootClose
                    placement={state.placement}
                    overlay={
                        <Popover id={Shortid.generate()} className="user-flip">
                        <span className="popover-title">{state.element.username + '\'s  Flips'}</span>
                            {_.map(state.flips, (item) => (
                                <div>
                                    <img src={`/flips/${item.flip_id}.png`} />
                                    <span className="flip-name">{item.title}</span>
                                    <span className="flip-earned">{item.earned}</span>
                                </div>
                            ))}
                        </Popover>
                    }
                >
                    {this.props.body}
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
