import React from 'react';
import {Button, Input} from 'react-bootstrap';

import Layout from 'layouts/one_col';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

const LABELS = {
    LOGIN: 'Email',
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
    getToken: function () {
        var req = HttpManager.GET({url: `${GLOBALS.API_URL}csrf_token`});
        req.then(res => {
            this.setState({_token: res.response});
        });
    },
    login: function () {
        var formData = new FormData();
        var req;
        formData.append('login', this.refs.login.getValue().toString());
        formData.append('password', this.refs.password.getValue());
        formData.append('_token', this.state._token);
        req = HttpManager.POST({
            url: `${GLOBALS.API_URL}auth/login`
        }, {
            'X-Csrf-Token': this.state._token,
            'Authorization': `Basic ${window.btoa(this.refs.login.getValue() + ':' + this.refs.password.getValue())}`
        });
        req.then(res => {
            debugger;
            console.log(res);
        });
    },
    onSubmit: function () {
    },
    render: function () {
        return (
           <Layout>
                <form method="POST" >
                    <input type="hidden" name="_token" value={this.state._token} />
                    <Input ref="login" type="text" name="email" label={LABELS.LOGIN} />
                    <Input ref="password" type="password" name="password" label={LABELS.PASSWORD} />
                    <Button onClick={this.login} >{LABELS.SUBMIT}</Button>
                </form>
           </Layout>
        );
    }
});

export default Page;

