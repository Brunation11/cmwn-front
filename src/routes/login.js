import React from 'react';
import {Button, Input} from 'react-bootstrap';

import Layout from 'layouts/one_col';

const LABELS = {
    LOGIN: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'SUBMIT'
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            _token: '29HhN4cSqh1vAhu2jU5VBiokpm1TGYqTRU9y077a'
        };
    },
    render: function () {
        return (
           <Layout>
                <form method="POST" action="/auth/login">
                    <input type="hidden" value={this.state._token} />
                    <Input type="text" label={LABELS.LOGIN} />
                    <Input type="password" label={LABELS.PASSWORD} />
                    <Button type="submit" >{LABELS.SUBMIT}</Button>
                </form>
           </Layout>
        );
    }
});

export default Page;

