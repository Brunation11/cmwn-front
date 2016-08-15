import React from 'react';
import _ from 'lodash';
import {Modal, Button, Input, Tabs, Tab} from 'react-bootstrap';
import { connect } from 'react-redux';

import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Store from 'components/store';
import GLOBALS from 'components/globals';

import Layout from 'layouts/one_col';

import 'routes/login.scss';

const LABELS = {
    LOGIN: 'Email | Username',
    PASSWORD: 'Password',
    SUBMIT: 'SUBMIT',
    RESET: 'Reset Password',
    FORGOT: 'Email'
};

const ERRORS = {
    LOGIN: 'Sorry, that wasn\'t quite right. Please try again.'
};

const MESSAGE_START = 'Don\'t have a login yet?  Contact your school to get started with Change ' +
 'My World Now and ';
const MESSAGE_LINK = 'submit a request';
const MESSAGE_END = ' for us to contact your school!';


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
            key: 1
        };
    },
    componentDidMount: function () {
        this.getToken();
        window.document.addEventListener('keydown', this.attemptLogin);
    },
    componentWillUnmount: function () {
        window.document.removeEventListener('keydown', this.attemptLogin);
    },
    handleSelect: function (index) {
        this.setState({key: index});
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
            Log.log(e, 'Invalid login');
        });
    },
    attemptLogin: function (e) {
        var user = this.getUsernameWithoutSpaces();
        var logout;
        var logoutUrl;
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
        var state = Store.getState();
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            //I know it might seem strange to track "currentUser", but even
            //unauthenticated visitors have a session and are allowed to take
            //a handful of actions, like forgot.
            req = HttpManager.POST({
                url: state.currentUser._links.forgot.href,
            }, {
                'email': this.refs.reset.getValue(),
            });
            req.then(res => {
                if (res.status < 300 && res.status >= 200) {
                    Toast.success('Password reset successful. Please check your email for the next step.');
                } else {
                    Toast.error(ERRORS.LOGIN + (res.response && res.response.data &&
                        res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                    Log.log(res, 'Password reset failure', req);
                }
            }).catch(err => {
                Log.log(err);
            });
        }
    },
    getUsernameWithoutSpaces: function () {
        var newLogin = this.refs.login.getValue().replace(/\s/g, '');
        return newLogin;
    },
    render: function () {
        return (
           <Layout>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} >
                    <Tab eventKey={1} title={'Login'}>
                        <br />
                        <form method="POST" id="login-form" >
                            <input type="hidden" name="_token" value={this.state._token} />
                            <Input ref="login" type="text" id="email" name="email" label={LABELS.LOGIN} />
                            <Input ref="password" type="password" id="password" name="password"
                                label={LABELS.PASSWORD} />
                            <Button
                                id="login-button"
                                onKeyPress={this.attemptLogin}
                                onClick={this.attemptLogin}
                            >
                                {LABELS.SUBMIT}
                            </Button>
                        </form>
                        <div><br /><p>
                            {MESSAGE_START}
                            <a onClick={this.displaySignupModal}>{MESSAGE_LINK}</a>
                            {MESSAGE_END}
                        </p></div>
                        <Modal show={this.state.signupOpen} onHide={() => this.setState({signupOpen: false})}>
                            <Modal.Body>
                                {SIGNUP}
                            </Modal.Body>
                        </Modal>
                    </Tab>
                    <Tab eventKey={2} title={'Forgot Password'} >
                        <br />
                        <form method="POST" >
                            <input type="hidden" name="_token" value={this.state._token} />
                            <Input ref="reset" type="text" name="email" label={LABELS.FORGOT} />
                            <Button onKeyPress={this.forgotPass} onClick={this.forgotPass}>
                                {LABELS.RESET}
                            </Button>
                        </form>
                    </Tab>
                </Tabs>
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
export default Page;
