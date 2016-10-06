import React from 'react';
import {Button, Input} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import History from 'components/history';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Form from 'components/form';

const PAGE_UNIQUE_IDENTIFIER = 'school-create';

const ERRORS = {
    BAD_UPDATE: 'There was a problem updating your profile. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

const LOG = {
    SERVER_REFUSE: 'Server refused profile update'
};

const REFS = {
    FORM: 'formRef',
    TITLE: 'titleInput'
};

var mapStateToProps;
var Page;

export class SchoolCreate extends React.Component {
    submitData() {
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
                    History.replace(`/districts/${res.response.data.uuid}?message=created`);
                }
            }).catch(err => {
                Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(LOG.SERVER_REFUSE, err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    }

    render() {
        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
                <Form ref={REFS.FORM}>
                    <Input
                        type="text"
                        value={this.state.title}
                        placeholder="District Name"
                        label="District Name"
                        validate="required"
                        ref={REFS.TITLE}
                        name={REFS.TITLE}
                        onChange={e => this.setState({title: e.target.value})} //eslint-disable-line camelcase
                    />
                    <Button onClick={this.submitData.bind(this)}> Create </Button>
                </Form>
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {title: ''};
    var loading = true;
    var currentUser;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        currentUser,
        loading
    };
};

Page = connect(mapStateToProps)(SchoolCreate);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

