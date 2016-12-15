import React from 'react';
import _ from 'lodash';
import {Modal, Button, Input} from 'react-bootstrap';
import { connect } from 'react-redux';

import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

import Layout from 'layouts/one_col';

import 'routes/login.scss';

const PAGE_UNIQUE_IDENTIFIER = 'login';

const LABELS = {
    LOGIN: 'USERNAME',
    PASSWORD: 'PASSWORD',
    RESET: 'Reset Password',
    FORGOT: 'USERNAME',
    USER_TYPE: 'ARE YOU A',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT'
};

const FORGOT_PASSWORD = 'I forgot my password';

const ERRORS = {
    LOGIN: 'Sorry, that wasn\'t quite right. Please try again.'
};

const SIGNUP_PROMPT = {
    HEADER: 'Don\'t have a login yet?',
    COPY_1: 'Contact your school to get started with Change My World Now and ',
    COPY_2: ' for us to contact your school!',
    LINK: 'SUBMIT A REQUEST',
    MOBILE_LINK: ' CLICK HERE'
};

const SIGNUP = (<span>
    <p>We are so excited about your interest to work with us!</p>
    <p dangerouslySetInnerHTML={{__html: 'Click <a href=\'mailto:&#106;&#111;&#110;&#105;&#064;' +
        '&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#099;&#097;' +
        '&#116;&#104;&#121;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;' +
        '&#111;&#109;?subject=Sign up with CMWN&body=Thank you for your interest in Change My ' +
        'World Now!%0D%0A%0D%0AIf you would like to launch Change My World Now in your school ' +
        'please provide the following information and someone from our team will contact you.' +
        '%0D%0A%0D%0AWhat is your relationship to the school?:%0D%0AYour Name:%0D%0AYour School' +
        ':%0D%0AYour Email:%0D%0ASchool Grades:' +
        '%0D%0APrincipal Name:%0D%0APrincipal Email:' +
        '%0D%0ASchool Phone:%0D%0ACity/State:\'>here</a> to contact us.'}}>
    </p>
</span>);

var Component = React.createClass({
    getInitialState: function () {
        return {
            loginOnNextPropChange: false,
            _token: '',
            background: _.sample(['bkg-1', 'bkg-2']),
            currentPage: 'login',
            selectedOption: 'student'
        };
    },
    componentDidMount: function () {
        this.getToken();
        window.document.addEventListener('keydown', this.attemptLogin);
    },
    componentWillUnmount: function () {
        window.document.removeEventListener('keydown', this.attemptLogin);
    },
    handlePageSelect: function () {
        if (this.state.currentPage === 'login') {
            this.setState({currentPage: 'forgot-password'});
        } else {
            this.setState({currentPage: 'login'});
        }
    },
    handleOptionSelect: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    displaySignupModal: function () {
        this.setState({signupOpen: true});
    },
    getToken: function () {
    },
    login: function (e) {
        var dataUrl;
        var req;
        var user = this.getUsernameWithoutSpaces();
        dataUrl = this.state.overrideLogin || this.props.currentUser._links.login.href;
        ga('send', 'event', 'Login', 'Attempted');
        req = HttpManager.POST({
            url: dataUrl,
        }, {
            'username': user,
            'password': this.refs.password.getValue()
        });
        req.then(res => {
            if (res.response && res.response.status && res.response.detail &&
                res.response.status === 401 && res.response.detail.toLowerCase() === 'reset_password'
            ) {
                History.push('/change-password');
                return;
            }
            if (res.status < 300 && res.status >= 200) {
                Log.info(e, 'User login success');
                ga('send', 'event', 'Login', 'Success');
                History.push('/profile');
            } else {
                Toast.error(ERRORS.LOGIN + (res.response && res.response.data &&
                    res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                Log.log(res, 'Invalid login.', req);
            }
        }).catch(res => {
            if (
                res.response &&
                res.response.status &&
                res.response.detail &&
                res.response.status === 401 &&
                res.response.detail.toLowerCase() === 'reset_password'
            ) {
                History.push('/change-password');
                return;
            }
            Toast.error(ERRORS.LOGIN + (res.detail ? ' Message: ' + res.detail : ''));
            ga('send', 'event', 'Login', 'Invalid');
            //ga('send', 'exception', {
            //    exDescription: 'Invalid login',
            //    exFatal: false
            //});
            Log.log(e, 'Invalid login');
        });
    },
    attemptLogin: function (e) {
        var user;
        var logout;
        var logoutUrl;

        if (this.state.currentPage === 'forgot-password') return;

        user = this.getUsernameWithoutSpaces();

        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            if (this.props.data._links && this.props.data._links.login == null) {
                if (user === this.props.data.username ||
                    user === this.props.data.email) {
                    History.push('/profile');
                }
            }
            if (!_.has(this, 'props.currentUser._links.login.href')) {
                //essentially, if you are trying to login as someone else, we assume
                //that you are not them and want to log you out.
                //also yes, I am cheating the logout url here.
                logoutUrl = GLOBALS.API_URL + 'logout';
                if (_.has(this, 'props.currentUser._links.logout.href')) {
                    logoutUrl = this.props.currentUser._links.logout.href;
                }

                logout = HttpManager.GET({url: logoutUrl, handleErrors: false});
                logout.then(() => {
                    if (_.has(this, 'props.currentUser._links.login.href')) {
                        this.login(...arguments);
                    } else {
                        HttpManager.GET({url: GLOBALS.API_URL})
                            .then(server =>
                                this.setState({overrideLogin: server.response._links.login.href}, () =>
                                    this.login(...arguments)));
                    }
                });
            } else if (this.props.loading) {
                this.setState({loginOnNextPropChange: e});
            } else {
                this.login(...arguments);
            }
        }
    },
    forgotPass: function (e) {
        var req;

        if (this.state.currentPage === 'login') return;

        if (this.state.selectedOption === 'student') {
            this.setState({currentPage: 'confirm-student'});
        } else {
            if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
                //I know it might seem strange to track "currentUser", but even
                //unauthenticated visitors have a session and are allowed to take
                //a handful of actions, like forgot.
                req = HttpManager.POST({
                    url: this.props.currentUser._links.forgot.href,
                }, {
                    'email': this.refs.reset.getValue(),
                });
                req.then(res => {
                    if (res.status < 300 && res.status >= 200) {
                        this.setState({currentPage: 'confirm-teacher'});
                        Toast.success(
                            'Password reset successful. Please check your email for the next step.'
                        );
                    } else {
                        Toast.error(ERRORS.LOGIN + (res.response && res.response.data &&
                            res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                        Log.log(res, 'Password reset failure', req);
                    }
                }).catch(err => {
                    Log.log(err);
                });
            }
        }
    },
    getUsernameWithoutSpaces: function () {
        var newLogin;
        try {
            newLogin = this.refs.login.getValue().replace(/\s/g, '');
        } catch(err) {
            //ref not yet mounted, probably somebody getting antsy and
            //hammering the enter key.
            newLogin = '';
        }
        return newLogin;
    },
    renderLogin: function () {
        return (
            <div className={`login-tab ${this.state.background}`}>
                <div className="login-container">
                    <div className="login-content">
                        <span className="header"></span>
                        <form method="POST" className="login-form">
                            <input
                                type="hidden"
                                name="_token"
                                value={this.state._token}
                            />
                            <Input
                                ref="login"
                                type="text"
                                id="username"
                                name="username"
                                label={LABELS.LOGIN}
                                placeholder="FUN-RABBIT003"
                            />
                            <Input
                                ref="password"
                                type="password"
                                id="password"
                                name="password"
                                label={LABELS.PASSWORD}
                                placeholder="PA********"
                            />
                            <Button
                                id="login-button"
                                className="login-button"
                                onKeyPress={this.attemptLogin}
                                onClick={this.attemptLogin}
                            />
                            <a
                                className="forgot-password-link"
                                onClick={this.handlePageSelect}
                            >
                                {FORGOT_PASSWORD}
                            </a>
                            <span className="signup-prompt">
                                <h2>{SIGNUP_PROMPT.HEADER}</h2>
                                <p>
                                    {SIGNUP_PROMPT.COPY_1}
                                    <a
                                        onClick={this.displaySignupModal}
                                    >
                                        <strong>{SIGNUP_PROMPT.LINK}</strong>
                                    </a>
                                    {SIGNUP_PROMPT.COPY_2}
                                </p>
                                <a
                                    className="mobile-link"
                                    onClick={this.displaySignupModal}
                                >
                                    {SIGNUP_PROMPT.MOBILE_LINK}
                                </a>
                            </span>
                        </form>
                    </div>
                    <Modal show={this.state.signupOpen} onHide={() => this.setState({signupOpen: false})}>
                        <Modal.Body>
                            {SIGNUP}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    },
    renderForgotPassword: function () {
        return (
            <div className={`forgot-password-tab ${this.state.background}`}>
                <div className="forgot-password-container">
                    <div className="forgot-password-content">
                        <span className="header"></span>
                        <form method="POST" className="forgot-password-form">
                            <input type="hidden" name="_token" value={this.state._token} />
                            <Input
                                ref="reset"
                                type="text"
                                id="username"
                                name="username"
                                label={LABELS.FORGOT}
                                placeholder="FUN-RABBIT003"
                            />
                            <p className="option-label">{LABELS.USER_TYPE}</p>
                            <Input
                                ref="student"
                                type="radio"
                                name="student"
                                value="student"
                                label={LABELS.STUDENT}
                                checked={this.state.selectedOption === 'student'}
                                onChange={this.handleOptionSelect}
                            />
                            <Input
                                ref="teacher"
                                type="radio"
                                name="teacher"
                                value="teacher"
                                label={LABELS.TEACHER}
                                checked={this.state.selectedOption === 'teacher'}
                                onChange={this.handleOptionSelect}
                            />
                            <Button
                                className="forgot-password-button"
                                onKeyPress={this.forgotPass}
                                onClick={this.forgotPass}
                            />
                            <span className="signup-prompt">
                                <h2>{SIGNUP_PROMPT.HEADER}</h2>
                                <p>
                                    {SIGNUP_PROMPT.COPY_1}
                                    <a
                                        onClick={this.displaySignupModal}
                                    >
                                        <strong>{SIGNUP_PROMPT.LINK}</strong>
                                    </a>
                                    {SIGNUP_PROMPT.COPY_2}
                                </p>
                                <a
                                    className="mobile-link"
                                    onClick={this.displaySignupModal}
                                >
                                    {SIGNUP_PROMPT.MOBILE_LINK}
                                </a>
                            </span>
                        </form>
                    </div>
                    <Modal show={this.state.signupOpen} onHide={() => this.setState({signupOpen: false})}>
                        <Modal.Body>
                            {SIGNUP}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    },
    renderConfirmTeacher: function () {
        return (
            <div className="teacher-confirm-password-reset-container bkg-3">
                <Button className="close-screen-button" onClick={this.handlePageSelect} />
                <a className="open-email-button" href="mailto: " />
            </div>
        );
    },
    renderConfirmStudent: function () {
        return (
            <div className="student-confirm-password-reset-container bkg-4">
                <Button className="close-screen-button" onClick={this.handlePageSelect} />
            </div>
        );
    },
    render: function () {
        var page;

        if (this.state.currentPage === 'forgot-password') {
            page = this.renderForgotPassword;
        } else if (this.state.currentPage === 'confirm-teacher') {
            page = this.renderConfirmTeacher;
        } else if (this.state.currentPage === 'confirm-student') {
            page = this.renderConfirmStudent;
        } else {
            page = this.renderLogin;
        }

        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                {page()}
           </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = {};
    var currentUser = {};
    var loading = true;
    if (state.page && state.page.data) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    return {
        data,
        currentUser,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
