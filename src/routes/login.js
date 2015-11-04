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
        var req = HttpManager.GET({url: 'http://cmwn/api/users/login'});
        req.then(res => {
            this.setState({_token: res.response});
        });
    },
    onSubmit: function () {
    },
    render: function () {
        return (
           <Layout>
                <form method="POST" action={`${GLOBALS.API_URL}users/login`} onSubmit={this.onSubmit}>
                    <input type="hidden" name="_token" value={this.state._token} />
                    <Input type="text" name="email" label={LABELS.LOGIN} />
                    <Input type="password" name="password" label={LABELS.PASSWORD} />
                    <Button type="submit" >{LABELS.SUBMIT}</Button>
                </form>
           </Layout>
        );
    }
});

export default Page;

