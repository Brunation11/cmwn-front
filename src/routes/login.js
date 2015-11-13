import React from 'react';
import {Button, Input} from 'react-bootstrap';
import Cookie from 'cookie';

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
        var req = HttpManager.GET({url: `${GLOBALS.API_URL}csrf_token`, withCredentials: true});
        req.then(res => {
            //this.setState({_token: res.response});
        });
    },
    login: function () {
        var req;
        req = HttpManager.POST({
            url: `${GLOBALS.API_URL}auth/login`,
            withCredentials: true
        }, '', {
            'X-XSRF-TOKEN': Cookie.parse(document.cookie)['XSRF-TOKEN'],
            'Authorization': `Basic ${window.btoa(this.refs.login.getValue() + ':' + this.refs.password.getValue())}`
        });
        req.then(res => {
            debugger;
            console.log(res);
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

