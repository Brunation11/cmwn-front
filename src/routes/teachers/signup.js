import React from 'react';
import {Button, Input} from 'react-bootstrap';
//import Cookie from 'cookie';

import Layout from 'layouts/one_col';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Authorization from 'components/authorization';
import GLOBALS from 'components/globals';

const LABELS = {
    LOGIN: 'Email',
    EMAIL: 'Email',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    PASSWORD: 'Password',
    SUBMIT: 'SUBMIT'
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
        var req, req2;
        if (e.keyCode === 13 || e.charCode === 13 || e.type === 'click') {
            req2 = HttpManager.POST({
                url: `${GLOBALS.API_URL}create_demo_teacher`
            }, {
                username: this.refs.login.getValue(),
                email: this.refs.login.getValue(),
                first_name: this.refs.first_name.getValue(),
                last_name: this.refs.last_name.getValue()
            });
            req2.then(() => {
                req = HttpManager.POST({
                    url: `${GLOBALS.API_URL}auth/login`,
                    withCredentials: true,
                    withoutXSRF: true,
                    handleErrors: false
                }, {}, {
                    'X-CSRF-TOKEN': this.state._token,
                    'Authorization': `Basic ${window.btoa(this.refs.login.getValue() + ':demo123')}`
                });
                req.then(res => {
                    if (res.status < 300 && res.status >= 200) {
                        Authorization.reloadUser();
                        History.replaceState(null, '/profile');
                    }
                }).catch(() => {
                    // @TODO MPR, 12/22/15: Alert user of error
                });
            });
        }
    },
    render: function () {
        return (
           <Layout>
                <form method="POST" >
                    <input type="hidden" name="_token" value={this.state._token} />
                    <Input ref="login" type="text" name="email" label={LABELS.EMAIL} />
                    <Input ref="first_name" type="text" name="first_name" label={LABELS.FIRST_NAME} />
                    <Input ref="last_name" type="text" name="last_name" label={LABELS.LAST_NAME} />
                    <Button onKeyPress={this.login} onClick={this.login} >{LABELS.SUBMIT}</Button>
                </form>
           </Layout>
        );
    }
});

export default Page;

