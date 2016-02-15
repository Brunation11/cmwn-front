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
            title: '',
            districtId: 1,
            code: ''
        };
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            systemId: this.state.districtId,
            systemid: this.state.districtId,
            system_id: this.state.districtId,
            code: this.state.code
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST({url: `${GLOBALS.API_URL}districts`, handleErrors: false}, postData).then(res => {
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
                    <Input
                        type="select"
                        value={this.state.districtId}
                        label="District ID"
                        validate="required"
                        ref="districtIdInput"
                        name="districtIdInput"
                        onChange={e => this.setState({districtId: e.target.value})}
                    >
                            <option value="1">NYDOE</option>
                    </Input>
                    <Input
                        type="text"
                        value={this.state.code}
                        placeholder="School Code"
                        label="School Code"
                        validate="required"
                        ref="codeInput"
                        name="codeInput"
                        onChange={e => this.setState({code: e.target.value})} //eslint-disable-line camelcase
                    />
                    <Button onClick={this.submitData}> Create </Button>
                </Form>
           </Layout>
        );
    }
});

export default Page;

