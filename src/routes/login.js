import React from 'react';
import {Button, Input} from 'react-bootstrap';
//import Cookie from 'cookie';

import Layout from 'layouts/one_col';
import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Authorization from 'components/authorization';
import GLOBALS from 'components/globals';

const LABELS = {
    LOGIN: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'SUBMIT'
};

const ERRORS = {
    LOGIN: 'Sorry, that wasn\'t quite right. Please try again.'
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            _token: ''
        };
    },
    componentWillMount: function () {
        this.getToken();
    },
    componentDidMount: function () {
        window.document.addEventListener('keydown', this.login);
    },
    componentWillUnmount: function () {
        window.document.removeEventListener('keydown', this.login);
    },
    getToken: function () {
        var req = HttpManager.GET({url: `${GLOBALS.API_URL}csrf_token`, withCredentials: true, withoutToken: true, withoutXSRF: true});
        req.then(res => {
            this.setState({_token: res.response.token});
            HttpManager.setToken(res.response.token);
        });
    },
    login: function (e) {
        var req;
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            req = HttpManager.POST({
                url: `${GLOBALS.API_URL}auth/login`,
                withCredentials: true,
                withoutXSRF: true,
                handleErrors: false
            }, {}, {
                'X-CSRF-TOKEN': this.state._token,
                'Authorization': `Basic ${window.btoa(this.refs.login.getValue() + ':' + this.refs.password.getValue())}`
            });
            req.then(res => {
                if (res.status < 300 && res.status >= 200) {
                    Authorization.reloadUser();
                    Log.info(e, 'User login success');
                    History.replaceState(null, '/profile');
                } else {
                    throw res;
                }
            }).catch(() => {
                Toast.error(ERRORS.LOGIN);
                Log.log(e, 'Invalid login');
            });
        }
    },
    render: function () {
        return (
           <Layout>
                <form method="POST" >
                    <input type="hidden" name="_token" value={this.state._token} />
                    <Input ref="login" type="text" name="email" label={LABELS.LOGIN} />
                    <Input ref="password" type="password" name="password" label={LABELS.PASSWORD} />
                    <Button onKeyPress={this.login} onClick={this.login} >{LABELS.SUBMIT}</Button>
                </form>
           </Layout>
        );
    }
});

export default Page;

