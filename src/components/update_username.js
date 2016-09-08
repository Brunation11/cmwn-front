import React from 'react';
import {Panel, Button, Glyphicon} from 'react-bootstrap';
import SweetAlert from 'sweetalert2';
import ClassNames from 'classnames';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Util from 'components/util';
import Store from 'components/store';

import 'components/update_username.scss';

const IDENTIFIER = 'change-username';
const CHANGE = 'create a new username';
const CONFIRM_SET = 'Are you sure you want to change your username? You will not be able to change it back to {0}.'; //eslint-disable-line max-len
const GOOD_UPDATED = 'Username updated to ';
const BAD_UPDATE = 'Could not update your user name.';

const BUTTONS = {
    GENERATE: 'Generate New Name',
    NEW: 'How about this one?',
    PREVIOUS: 'This name is still available!',
    ORIGINAL: 'You can also keep your original.',
    CONFIRM: 'Yes, change it!',
    CANCEL: 'No',
};

const TITLES = {
    SAVED: 'SAVED!',
    ERROR: 'OH NO!'
};

const COPY = {
    NOTE: 'Click to select the name you want.',
    DISCLAIMER: 'Note: Once you change your username, you won\'t be able to go back to your original.'
};

var UpdateUsername = React.createClass({
    getInitialState: function () {
        return {
            username: this.props.username.slice(0, -3),
            option: this.props.username.slice(0, -3),
            last: this.props.username.slice(0, -3),
            original: this.props.username.slice(0, -3),
            loading: false
        };
    },
    getDefaultProps: function () {
        return {
            copy: ''
        };
    },
    reloadChildUsername: function () {
        var self = this;

        var resetLoading = function () {
            setTimeout(function () {
                self.setState({
                    loading: false
                });
            }, 500);
        };

        self.setState({loading: true});

        HttpManager.GET({url: `${GLOBALS.API_URL}user-name`}).then(server => {
            self.setState({
                last: self.state.option,
                option: server.response.user_name
            });
            resetLoading();
        }).catch(err => {  // eslint-disable-line
            resetLoading();
        });

        self.setStyleOnClick();
    },
    setStyleOnClick: function () {
        this.setState({tooltipsOpen: true});
    },
    setChildUsername: function () {
        SweetAlert({
            text: Util.formatString(CONFIRM_SET, this.state.original),
            type: 'warning',
            showConfirmButton: true,
            confirmButtonText: BUTTONS.CONFIRM,
            confirmButtonColor: '#47B72C',
            confirmButtonClass: 'cmwn-font float-shadow',
            showCancelButton: true,
            cancelButtonText: BUTTONS.CANCEL,
            cancelButtonColor: '#7829BB',
            cancelButtonClass: 'cmwn-font float-shadow',
            closeOnConfirm: false,
            buttonStyling: false
        }).then(isConfirm => {
            if (isConfirm) {
                HttpManager.POST({
                    url: Store.getState().page.data._links.user_name.href
                }, {
                    user_name: this.state.option // eslint-disable-line
                }).then(server => {
                    this.setState({
                        username: this.state.option
                    });
                    SweetAlert({
                        title: TITLES.SAVED,
                        text: (GOOD_UPDATED + server.response.username + '!'),
                        type: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }).catch(err => {
                    SweetAlert({
                        title: TITLES.ERROR,
                        text: (BAD_UPDATE + (err.message ? ' Message: ' + err.message : '')),
                        type: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                });
            }
        });
    },
    resetLast: function () {
        this.setState({option: this.state.last, last: this.state.option});
    },
    resetOriginal: function () {
        this.setState({option: this.state.original, last: this.state.option});
    },
    updateAdultUsername: function () {
        HttpManager.GET().then(server => {}).catch(err => {}); // eslint-disable-line
    },
    renderAdult: function () {},
    renderChild: function () {
        return (
           <div className="update-username-container">
                <div className={ClassNames('animated loading', {
                    hidden: !this.state.loading
                })}>
                    <div className="loader" />
                </div>
                <div className="left">
                    <Button
                        className="purple username-btn username-picker generate"
                        onClick={this.reloadChildUsername}
                    >
                        <Glyphicon glyph="repeat" /> {BUTTONS.GENERATE}
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" id="cur-choice-btn"
                        onClick={this.setChildUsername}>
                        {BUTTONS.CONFIRM}
                        <br />
                        <span className="username username-picker">
                            {this.state.option}
                        </span>
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" id="last-choice-btn"
                            onClick={this.resetLast}>
                        {BUTTONS.PREVIOUS}
                        <br />
                        <span className="username username-picker">
                            {this.state.last}
                        </span>
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" id="original-choice-btn"
                        onClick={this.resetOriginal}>
                        {BUTTONS.ORIGINAL}
                        <br />
                        <span className="username username-picker">
                            {this.state.original}
                        </span>
                    </Button>
                </div>
                <div className="right">
                    <div className={ClassNames('note', {open: this.state.tooltipsOpen})}>
                        <p>{COPY.NOTE}</p>
                        <p className="disclaimer">{COPY.DISCLAIMER}</p>
                    </div>
                </div>
           </div>
        );
    },
    render: function () {
        var displayUpdate;
//        if (this.props.userType === 'CHILD') {
        displayUpdate = this.renderChild;
//        } else {
//            displayUpdate = this.renderAdult;
//        }
        return (
           <Panel header={CHANGE} className={this.props.className + ' standard ' + IDENTIFIER}>
               {displayUpdate()}
           </Panel>
        );
    }
});

export default UpdateUsername;

