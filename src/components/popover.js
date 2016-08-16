import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Shortid from 'shortid';
import Moment from 'moment';
import _ from 'lodash';

import 'components/popover.scss';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

const COPY = {
    NOFLIPS: "It Looks like this user hasn't earned any flips."
}

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
        return (
            <ButtonToolbar>
                <OverlayTrigger
                    trigger={this.state.trigger}
                    rootClose
                    placement={this.state.placement}
                    overlay={
                        <Popover
                            id={Shortid.generate()}
                            title={
                                this.state.element.title +
                                '  |  earned: ' +
                                Moment(this.state.element.earned).format('MMM Do YYYY')
                            }
                        >
                            {this.state.element.description}
                        </Popover>}>
                        <img
                            src={`/flips/${this.state.element.flip_id}-earned.gif`}
                        />
                </OverlayTrigger>
            </ButtonToolbar>
        );
    },
    getUserFlips: function () {
        HttpManager.GET({
            url: (`${GLOBALS.API_URL}user/${this.state.element.friend_id || this.state.element.suggest_id}/flip`),
            handleErrors: false
        })
        .then(res => {
            this.setState({flips: res.response._embedded.flip_user});
        });
    },
    renderUserFlips: function () {
        if (this.state.flips.length) {
            return _.map(this.state.flips, (flip) => {
                return (
                    <img
                        className="hover-flips"
                        key={Shortid.generate()}
                        src={`/flips/${flip.flip_id}-earned.gif`}
                    />
                );
            });
        } else {
            return (
               <p>{COPY.NOFLIPS}</p>
            )
        }
    },
    renderUser: function () {
        if (this.state.element.friend_id || this.state.element.suggest_id) this.getUserFlips();
        if (this.state.flips) {
            return (
                <ButtonToolbar>
                    <OverlayTrigger
                        trigger={this.state.trigger}
                        rootClose placement={this.state.placement}
                        overlay={(
                            <Popover
                                id={Shortid.generate()}
                                className="user-popover"
                                title={`Earned: ${this.state.flips.length}`}
                            >
                                {this.renderUserFlips()}
                            </Popover>
                        )}
                    >
                        {this.props.children}
                    </OverlayTrigger>
                </ButtonToolbar>
            );
        }
    },
    render: function () {
        var popover;
        if (this.state.type === 'flip') {
            popover = this.renderFlip();
        } else if (this.state.type === 'user') {
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
