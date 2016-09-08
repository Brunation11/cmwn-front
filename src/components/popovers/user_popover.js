import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Shortid from 'shortid';
import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Log from 'components/log';

import 'components/popovers/popover.scss';

const COPY = {
    NOFLIPS: 'It Looks like this user hasn\'t earned any flips.',
    BADFLIP: 'Flips could not be extracted from user'
};

export default class UserPopover extends React.Component {
    constructor() {
        super();

        this.state = {
            element: [],
            trigger: 'hover',
            placement: 'bottom'
        };
    }

    componentDidMount() {
        this.setState({
            element: this.props.element,
            trigger: this.props.trigger || this.state.trigger,
            placement: this.props.placement || this.state.placement,
            type: this.props.type
        });

        this.getUserFlips();

        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    getUserFlips() {
        var userID = this.props.element.friend_id || this.props.element.suggest_id;
        HttpManager.GET({
            url: (`${GLOBALS.API_URL}user/${userID}/flip`),
            handleErrors: false
        })
        .then(res => {
            if (res.response._embedded) {
                this.setState({flips: res.response._embedded.flip_user});
            }
        }).catch(e => {
            Log.error(e, COPY.BADFLIP);
        });
    }

    renderUserFlips() {
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
            );
        }
    }

    render() {
        if (!this._mounted || !this.state.flips) {
            return null;
        }

        return (
            <ButtonToolbar id={Shortid.generate()}>
                <OverlayTrigger
                    trigger={this.state.trigger}
                    rootClose
                    placement={this.state.placement}
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
}
