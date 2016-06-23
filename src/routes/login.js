import React from 'react';
import {Button, Input, Tabs, Tab} from 'react-bootstrap';
import { connect } from 'react-redux';

import Util from 'components/util';
import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Store from 'components/store';

import Layout from 'layouts/one_col';

const LABELS = {
    LOGIN: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'SUBMIT',
    RESET: 'Reset Password'
};

const ERRORS = {
    LOGIN: 'Sorry, that wasn\'t quite right. Please try again.'
};

var Component = React.createClass({
    getInitialState: function () {
        return {
            _token: '',
            key: 1
        };
    },
    componentDidMount: function () {
        this.getToken();
        window.document.addEventListener('keydown', this.login);
    },
    componentWillUnmount: function () {
        window.document.removeEventListener('keydown', this.login);
    },
    handleSelect: function (index) {
        this.setState({key: index});
    },
    getToken: function () {
    },
    login: function (e) {
        var req;
        var dataUrl;
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            if (this.props.data._links && this.props.data._links.login == null) {
                if (this.refs.login.getValue() === this.props.data.username || this.refs.login.getValue() === this.props.data.email) {
                    History.push('/profile');
                } else {
                    //but why
                    History.push('/logout');
                }
            }
            dataUrl = this.props.data._links.login.href;
            Util.logout();
            req = HttpManager.POST({
                url: dataUrl,
            }, {
                'username': this.refs.login.getValue(),
                'password': this.refs.password.getValue()
            });
            req.then(res => {
                if (res.response && res.response.status && res.response.detail && res.response.status === 401 && res.response.detail.toLowerCase() === 'reset_password') {
                    History.push('/change-password');
                    return;
                }
                if (res.status < 300 && res.status >= 200) {
                    Log.info(e, 'User login success');
                    History.push('/profile');
                } else {
                    Toast.error(ERRORS.LOGIN + (res.response && res.response.data && res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                    Log.log(res, 'Invalid login.', req);
                }
            }).catch(res => {
                if (res.response && res.response.status && res.response.detail && res.response.status === 401 && res.response.detail.toLowerCase() === 'reset_password') {
                    History.push('/change-password');
                    return;
                }
                Toast.error(ERRORS.LOGIN + (res.detail ? ' Message: ' + res.detail : ''));
                Log.log(e, 'Invalid login');
            });
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
                    Toast.error(ERRORS.LOGIN + (res.response && res.response.data && res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                    Log.log(res, 'Password reset failure', req);
                }
            }).catch(err => {
                Log.log(err);
            });
        }
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
                            <Input ref="password" type="password" id="password" name="password" label={LABELS.PASSWORD} />
                            <Button id="login-button" onKeyPress={this.login} onClick={this.login} >{LABELS.SUBMIT}</Button>
                        </form>
                    </Tab>
                    <Tab eventKey={2} title={'Forgot Password'} >
                        <br />
                        <form method="POST" >
                            <input type="hidden" name="_token" value={this.state._token} />
                            <Input ref="reset" type="text" name="email" label={LABELS.LOGIN} />
                            <Button onKeyPress={this.forgotPass} onClick={this.forgotPass} >{LABELS.RESET}</Button>
                        </form>
                    </Tab>
                </Tabs>
           </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.currentUser) {
        loading = state.page.loading;
        data = state.currentUser;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

