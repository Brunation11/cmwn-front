import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import ClassNames from 'classnames';
import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';

import 'components/update_username.scss';

const GOOD_UPDATE = 'Username updated to ';
const BAD_UPDATE = 'Could not update your user name to ';

const CALL_TO_ACTION = '*CLICK YOUR PREFERRED USERNAME';

const LABELS = {
    CURRENT: 'CURRENT USERNAME:',
    SAVE: 'STEP 3: DON\'T FORGET TO'
};

const BUTTONS = {
    ORIGINAL: 'KEEP IT!'
};

const COPY = {
    CONFIRM_NOTICE_1: 'You will not be able to',
    CONFIRM_NOTICE_2: 'get your old name again!',
    LOGIN_NOTICE: 'Next time you will log in as:'
};

export class UpdateUsername extends React.Component {
    constructor() {
        super();

        this.state = _.defaults({
            loading: false,
            page: 'generator',
            generatorOn: false
        });
    }

    componentDidMount() {
        if (this.props && this.props.currentUser) {
            this.setState({
                original: this.props.currentUser.username.slice(0, -3),
                username: this.props.currentUser.username
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentUser !== nextProps.currentUser) {
            this.setState({
                original: nextProps.currentUser.username.slice(0, -3)
            });
        }
    }

    reloadChildUsername() {
        var self = this;

        var resetLoading = function () {
            setTimeout(function () {
                self.setState({
                    loading: false
                });
            }, 500);
        };

        self.setState({
            loading: true
        });

        HttpManager.GET({
            url: this.props.currentUser._links.user_name.href
        })
        .then(server => {
            self.setState({
                selected: null,
                last: self.state.option,
                option: server.response.user_name
            });
            resetLoading();
        }).catch(err => {  // eslint-disable-line
            resetLoading();
        });
    }

    setChildUsername() {
        HttpManager.POST({
            url: this.props.currentUser._links.user_name.href
        }, {
            'user_name': this.state.option
        }).then(server => {
            this.setState({
                username: server.response.username
            });
            Toast.success(`${GOOD_UPDATE}${server.response.username}`);
        }).catch(err => {
            Toast.error(`${BAD_UPDATE}${this.state.option}`);
            Log.error(`Username not updated: ${err.message}`, err);
        });

        this.setState({
            page: 'login-notice'
        });
    }

    showModal() {
        this.setState({generatorOn: true});
    }

    hideModal() {
        this.setState({generatorOn: false});
    }

    handleSelect(username) {
        this.setState({
            selected: username
        });
    }

    setOriginal() {
        this.setState({
            selected: this.state.original,
            page: 'login-notice'
        });
    }

    setNewUsername() {
        this.setState({
            page: 'confirm'
        });
    }

    renderGenerator() {
        var self = this;
        return (
            <div className={`update-username-container ${this.state.page}`}>
                {/* loader */}
                <div className={ClassNames('animated loading', {hidden: !self.state.loading})}>
                    <div className="loader" />
                </div>

                {/* Step 1 container */}
                <div className="container step-1-container">
                    {/* Step 1 icon */}
                    <span className="step-1">1</span>
                    {/* Generated username field */}
                    <span className="generated">{self.state.option}</span>
                    {/* Generate username button */}
                    <Button
                        className="generate-btn animated slideInDown"
                        onClick={self.reloadChildUsername.bind(self)}
                    />
                </div>

                {/* Current username container */}
                <div className="container current-username-container">
                    {/* Current username field */}
                    <span className="original-label">{LABELS.CURRENT}</span>
                    <span className="original">{self.state.original}</span>
                    {/* Keep current username button */}
                    <Button
                        className="original-btn"
                        onClick={self.setOriginal.bind(self)} //update function to render login notice
                    >
                        {BUTTONS.ORIGINAL}
                    </Button>
                </div>

                {/* Call to action container */}
                <div className="container call-to-action-container">
                    <span className="call-to-action">{CALL_TO_ACTION}</span>
                </div>

                {/* Step 2 container */}
                <div className="container step-2-container">
                    <Button
                        className={ClassNames(
                            'option',
                            {
                                selected: self.state.selected && self.state.selected === self.state.option,
                                'not-selected': self.state.selected &&
                                                self.state.option &&
                                                self.state.selected !== self.state.option
                            }
                        )}
                        onClick={self.handleSelect.bind(self, self.state.option)}
                    >
                        {self.state.option}
                    </Button>
                    <Button
                        className={ClassNames(
                            'last',
                            {
                                selected: self.state.selected && self.state.selected === self.state.last,
                                'not-selected': self.state.selected &&
                                                self.state.last &&
                                                self.state.selected !== self.state.last
                            }
                        )}
                        onClick={self.handleSelect.bind(self, self.state.last)}
                    >
                        {self.state.last}
                    </Button>
                    {/* Step 2 icon */}
                    <span className="step-2">2</span>
                </div>

                {/* Step 3 container */}
                <div className="container step-3-container">
                    <span className="step-3">{LABELS.SAVE}</span>
                    <Button
                        className="save-btn"
                        onClick={this.setNewUsername.bind(this)}
                    />
                </div>

            </div>
        );
    }

    renderConfirmation() {
        return (
            <div className={`confirmation-container ${this.state.page}`}>
                <img className="header" src={`${GLOBALS.MEDIA_URL}8aa292e3231eb77be37da7ae0225799e.png`} />
                <span className="prompt">{COPY.CONFIRM_NOTICE_1}</span>
                <span className="prompt">{COPY.CONFIRM_NOTICE_2}</span>
                <Button
                    className="cancel-btn"
                    onClick={this.setOriginal.bind(this)}
                />
                <Button
                    className="confirm-btn"
                    onClick={this.setChildUsername.bind(this)}
                />
            </div>
        );
    }

    renderLoginNotice() {
        return (
            <div className={`login-notice-container ${this.state.page}`}>
                <img className="header" src={`${GLOBALS.MEDIA_URL}b9567bafdf9c186ccac49a3c32c45ae8.png`} />
                <span className="prompt">{COPY.LOGIN_NOTICE}</span>
                <span className="username">{this.state.username}</span>
            </div>
        );
    }

    renderDesktop() {
        var page;

        if (this.state.page === 'confirm') {
            page = this.renderConfirmation;
        } else if (this.state.page === 'login-notice') {
            page = this.renderLoginNotice;
        } else {
            page = this.renderGenerator;
        }

        return (
            <div className="desktop">
                {page.call(this)}
                <Button
                    className="close-modal-btn"
                    onClick={this.hideModal.bind(this)}
                />
            </div>
        );
    }

    renderMobile() {
        var page;

        if (this.state.page === 'confirm') {
            page = this.renderConfirmation;
        } else if (this.state.page === 'login-notice') {
            page = this.renderLoginNotice;
        } else {
            page = this.renderGenerator;
        }

        return(
            <div className="mobile">
                <Button
                    className="close-modal-btn"
                    onClick={this.hideModal.bind(this)}
                >
                    <span className="original-label">{LABELS.CURRENT}</span>
                    <span className="original">{this.state.original}</span>
                    <span className="prompt">{BUTTONS.MOBILE_ORIGINAL}</span>
                </Button>
                {page.call(this)}
            </div>
        );
    }

    render() {
        var page;

        if (this.state.page === 'confirm') {
            page = this.renderConfirmation;
        } else if (this.state.page === 'login-notice') {
            page = this.renderLoginNotice;
        } else {
            page = this.renderGenerator;
        }

        return (
            <div>
                <Modal
                    className="username-generator-modal"
                    show={this.state.generatorOn}
                    onHide={this.hideModal.bind(this)}
                    keyboard={false}
                    backdrop="static"
                    id="username-genetator-modal"
                >
                    <Modal.Body>
                        {page.call(this)}
                        <Button
                            className="close-modal-btn"
                            onClick={this.hideModal.bind(this)}
                        />
                    </Modal.Body>
                </Modal>

                <Button
                    className="update-username-btn"
                    onClick={this.showModal.bind(this)}
                >
                    CHANGE
                </Button>
            </div>
        );
    }
}

export default UpdateUsername;


