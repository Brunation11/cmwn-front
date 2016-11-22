/* eslint-disable max-lines */
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
    CURRENT: 'CURRENT USERNAME: ',
    SAVE: 'STEP 3: DON\'T FORGET TO',
    SELECT: 'CLICK YOUR PREFERRED USERNAME',
    WELCOME: 'name generator',
    INSTRUCTIONS: [
        'NOT SURE HOW THIS WORKS?',
        'SWIPE FOR INSTRUCTIONS',
        'BACK TO HOME'
    ]
};
const BUTTONS = {
    ORIGINAL: 'KEEP IT!',
    MOBILE_ORIGINAL: 'TAP TO KEEP IT',
    STEP_TWO_PROMPT: 'GOOD JOB!',
    STEP_TWO: 'CONTINUE TO STEP 2',
    STEP_THREE_PROMPT: 'ALMOST DONE!',
    STEP_THREE: 'CONTINUE TO STEP 3'
};
const COPY = {
    CONFIRM_NOTICE: [
        'You will not be able to',
        'get your old name again!'
    ],
    LOGIN_NOTICE: 'Next time you will log in as:',
    INSTRUCTIONS_HEADER: 'How to use the name generator:',
    INSTRUCTIONS: [
        '1. Tap the "Generate Name" button.',
        'A new username will appear in the box.',
        'Then tap the bottom arrow to go to step two.',
        '2. You will then see your old username and the new one that was just generated.',
        'Tap the one you want, then go to step three.',
        '3. Confirm which name you want to use.',
        'Remember: if you choose the new name, you can\'t get your old one back.'
    ]
};
const ASSETS = {
    DESKTOP_CONFIRMATION_HEADER: `${GLOBALS.MEDIA_URL}8aa292e3231eb77be37da7ae0225799e.png`,
    MOBILE_CONFIRMATION_HEADER: `${GLOBALS.MEDIA_URL}8aa292e3231eb77be37da7ae0225799e.png`,
    LOGIN_NOTICE_HEADER: `${GLOBALS.MEDIA_URL}b9567bafdf9c186ccac49a3c32c45ae8.png`,
};

export class UpdateUsername extends React.Component {
    constructor() {
        super();

        this.state = _.defaults({
            loading: false,
            page: 'welcome',
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
            'user_name': this.state.selected
        }).then(server => {
            this.setState({
                username: server.response.username,
                original: server.response.username.slice(0, -3)
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
        this.setState({
            generatorOn: false,
            page: 'welcome',
            option: null,
            last: null
        });
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

    setPage(page) {
        this.setState({
            page: page
        });
    }

    renderDesktopGenerator() {
        var self = this;
        return (
            <div className={`desktop-update-username-container ${this.state.page}`}>
                <div className={ClassNames('animated loading', {hidden: !self.state.loading})}>
                    <div className="loader" />
                </div>

                <div className="container step-1-container">
                    <span className="step-1">1</span>
                    <span className="generated">{self.state.option}</span>
                    <Button
                        className="generate-btn animated slideInDown"
                        onClick={self.reloadChildUsername.bind(self)}
                    />
                </div>

                <div className="container current-username-container">
                    <span className="original-label">{LABELS.CURRENT}</span>
                    <span className="original">{self.state.original}</span>
                    <Button
                        className="original-btn"
                        onClick={self.setOriginal.bind(self)}
                    >
                        {BUTTONS.ORIGINAL}
                    </Button>
                </div>

                <div className="container call-to-action-container">
                    <span className="call-to-action">{CALL_TO_ACTION}</span>
                </div>

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
                    <span className="step-2">2</span>
                </div>

                <div className="container step-3-container">
                    <span className="step-3">{LABELS.SAVE}</span>
                    <Button
                        className="save-btn"
                        onClick={this.setPage.bind(this, 'confirmation')}
                    />
                </div>

            </div>
        );
    }

    renderDesktopConfirmation() {
        return (
            <div className={`desktop-confirmation-container ${this.state.page}`}>
                <img className="header" src={ASSETS.DESKTOP_CONFIRMATION_HEADER} />
                <span className="prompt">{COPY.CONFIRM_NOTICE[0]}</span>
                <span className="prompt">{COPY.CONFIRM_NOTICE[1]}</span>
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

    renderWelcome() {
        var scrollIntoView = function (id) {
            document.getElementById(id).scrollIntoView();
        };

        return (
            <div className={`mobile-welcome-container ${this.state.page}`}>
                <div id="welcome-container" className="welcome-container">
                    <div className="content">
                        <span className="prompt">{LABELS.WELCOME}</span>
                        <Button
                            className="start-btn"
                            onClick={this.setPage.bind(this, 'generator')}
                        />
                    </div>
                    <div
                        className="instructions-prompt-container"
                        onClick={scrollIntoView.bind(this, 'instructions-container')}
                    >
                        <span className="prompt">{LABELS.INSTRUCTIONS[0]}</span>
                        <span className="prompt">{LABELS.INSTRUCTIONS[1]}</span>
                    </div>
                </div>

                <div id="instructions-container" className="instructions-container">
                    <div
                        className="instructions-prompt-container"
                        onClick={scrollIntoView.bind(this, 'welcome-container')}
                    >
                        <span className="prompt">{LABELS.INSTRUCTIONS[2]}</span>
                    </div>
                    <div className="instructions">
                        <span className="copy-header">{COPY.INSTRUCTIONS_HEADER}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[0]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[1]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[2]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[3]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[4]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[5]}</span>
                        <span className="copy">{COPY.INSTRUCTIONS[6]}</span>
                    </div>
                </div>
            </div>
        );
    }

    renderMobileGenerator() {
        return (
            <div className={`mobile-update-username-container ${this.state.page}`}>
                <div className="content">
                    <div className="container step-1-container">
                        <div className="generated">{this.state.option}</div>
                        <Button
                            className="generate-btn animated slideInDown"
                            onClick={this.reloadChildUsername.bind(this)}
                        />
                    </div>
                </div>

                <div className="next">
                    <span className="label">{BUTTONS.STEP_TWO_PROMPT}</span>
                    <span className="label">{BUTTONS.STEP_TWO}</span>
                </div>

                <Button
                    className="next-btn"
                    onClick={this.setPage.bind(this, 'select')}
                />
            </div>
        );
    }

    renderMobileSelect() {
        return (
            <div className={`mobile-select-container ${this.state.page}`}>
                <span className="prompt">{LABELS.SELECT}</span>
                <div className="content">
                    <Button
                        className={ClassNames(
                            'option',
                            {
                                selected: this.state.selected && this.state.selected === this.state.option
                            }
                        )}
                        onClick={this.handleSelect.bind(this, this.state.option)}
                    >
                        {this.state.option}
                    </Button>
                    <Button
                        className={ClassNames(
                            'last',
                            {
                                selected: this.state.selected && this.state.selected === this.state.last,
                            }
                        )}
                        onClick={this.handleSelect.bind(this, this.state.last)}
                    >
                        {this.state.last}
                    </Button>
                </div>
                <Button
                    className="prev-btn"
                    onClick={this.setPage.bind(this, 'generator')}
                />
                <div className="next">
                    <span className="label">{BUTTONS.STEP_TWO_PROMPT}</span>
                    <span className="label">{BUTTONS.STEP_TWO}</span>
                </div>
                <Button
                    className="next-btn"
                    onClick={this.setPage.bind(this, 'confirmation')}
                />
            </div>

        );
    }

    renderMobileConfirmation() {
        return (
            <div className={`mobile-confirmation-container ${this.state.page}`}>
                <img className="header" src={ASSETS.MOBILE_CONFIRMATION_HEADER} />
                <div className="prompt-container">
                    <span className="prompt">{COPY.CONFIRM_NOTICE_1}</span>
                    <span className="prompt">{COPY.CONFIRM_NOTICE_2}</span>
                </div>
                <div className="content">
                    <Button
                        className="original"
                        onClick={this.setOriginal.bind(this)}
                    >
                        {this.state.original}
                    </Button>
                    <Button
                        className="selected-option"
                        onClick={this.setChildUsername.bind(this)}
                    >
                        {this.state.selected}
                    </Button>
                </div>
            </div>
        );
    }

    renderLoginNotice() {
        return (
            <div className={`login-notice-container ${this.state.page}`}>
                <img className="header" src={ASSETS.LOGIN_NOTICE_HEADER} />
                <span className="prompt">{COPY.LOGIN_NOTICE}</span>
                <span className="username">{this.state.username}</span>
                <div className="content">
                    <Button
                        className="mobile-close-modal-btn"
                        onClick={this.hideModal.bind(this)}
                    />
                </div>
            </div>
        );
    }

    renderDesktop() {
        var page;

        if (this.state.page === 'login-notice') {
            page = this.renderLoginNotice;
        } else if (this.state.page === 'confirmation') {
            page = this.renderDesktopConfirmation;
        } else {
            page = this.renderDesktopGenerator;
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

        if (this.state.page === 'login-notice') {
            page = this.renderLoginNotice;
        } else if (this.state.page === 'confirmation') {
            page = this.renderMobileConfirmation;
        } else if (this.state.page === 'select') {
            page = this.renderMobileSelect;
        } else if (this.state.page === 'generator') {
            page = this.renderMobileGenerator;
        } else {
            page = this.renderWelcome;
        }

        return (
            <div className={`mobile ${this.state.page}`}>
                <Button
                    className="close-modal-btn"
                    onClick={this.hideModal.bind(this)}
                >
                    <span className="original-label">
                        {LABELS.CURRENT}
                        <span className="original">
                            {this.state.original}
                        </span>
                    </span>
                    <span className="prompt">{BUTTONS.MOBILE_ORIGINAL}</span>
                </Button>
                {page.call(this)}
            </div>
        );
    }

    render() {
        return (
            <div>
                <Modal
                    className={`username-generator-modal ${this.state.page}`}
                    show={this.state.generatorOn}
                    onHide={this.hideModal.bind(this)}
                    keyboard={false}
                    backdrop="static"
                    id="username-genetator-modal"
                >
                    <Modal.Body>
                        {this.renderDesktop.call(this)}
                        {this.renderMobile.call(this)}
                    </Modal.Body>
                </Modal>

                <Button
                    className={`update-username-btn ${this.props.className}`}
                    onClick={this.showModal.bind(this)}
                >
                    CHANGE
                </Button>
            </div>
        );
    }
}

export default UpdateUsername;
