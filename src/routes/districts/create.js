import React from 'react';
import {Button, Input} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import History from 'components/history';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Form from 'components/form';

const ERRORS = {
    BAD_UPDATE: 'There was a problem updating your profile. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },
    submitData: function () {
        var postData = {
            username: this.state.username
        };
        if (!this.state.isStudent) {
            if (this.state.email) {
                //postData.email = this.state.email;
            }
            postData.gender = this.state.gender;
        }
        if (this.refs.formRef.isValid()) {
            HttpManager.POST(`${GLOBALS.API_URL}districts`, postData).then(res => {
                if (res.response && res.response.data && res.response.data.uuid) {
                    History.replaceState(null, `/districts/${res.response.data.uuid}?message=created`);
                }
            }).catch(err => {
                Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused profile update', err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    },
    render: function () {
        return (
           <Layout>
                <Form ref="formRef">
                    <Input
                        type="text"
                        value={this.state.title}
                        placeholder="District Name"
                        label="District Name"
                        validate="required"
                        ref="titleInput"
                        name="titleInput"
                        onChange={e => this.setState({title: e.target.value})} //eslint-disable-line camelcase
                    />
                    <Button onClick={this.submitData}> Create </Button>
                </Form>
           </Layout>
        );
    }
});

export default Page;


