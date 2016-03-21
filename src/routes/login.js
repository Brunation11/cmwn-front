import React from 'react';
import {Button, Input, Tabs, Tab} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/one_col';
import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Authorization from 'components/authorization';

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
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            req = HttpManager.POST({
                //url: this.props.data._links.login.href,
                url: GLOBALS.API_URL + 'login'
            }, {
                'username': this.refs.login.getValue(),
                'password': this.refs.password.getValue()
            });
            req.then(res => {
                if (res.status < 300 && res.status >= 200) {
                    Authorization.reloadUser(res.response).then(() => {
                        Log.info(e, 'User login success');
                        History.push('/profile');
                    });
                } else {
                    Toast.error(ERRORS.LOGIN + (res.response && res.response.data && res.response.data.message ? ' Message: ' + res.response.data.message : ''));
                    Log.log(res, 'Invalid login.', req);
                }
            }).catch(err => {
                Toast.error(ERRORS.LOGIN + (err.message ? ' Message: ' + err.message : ''));
                Log.log(e, 'Invalid login');
            });
        }
    },
    forgotPass: function (e) {
        var req;
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            req = HttpManager.POST({
                url: this.props.data._links.forgot.href,
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
                        <form method="POST" >
                            <input type="hidden" name="_token" value={this.state._token} />
                            <Input ref="login" type="text" name="email" label={LABELS.LOGIN} />
                            <Input ref="password" type="password" name="password" label={LABELS.PASSWORD} />
                            <Button onKeyPress={this.login} onClick={this.login} >{LABELS.SUBMIT}</Button>
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

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

