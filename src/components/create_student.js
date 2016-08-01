import React from 'react';
import { connect } from 'react-redux';

import Log from 'components/log';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import Form from 'components/form';
import History from 'components/history';
import GLOBALS from 'components/globals';

const HEADINGS = {
    CREATE_USER: 'Create User in this Class'
};

const ERRORS = {
    BAD_UPDATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

var CreateStudent = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },
    componentDidMount: function () {
        this.setState(this.props);
    },
    submitData: function () {
        var postData = {
            first_name: this.state.first, //eslint-disable-line camelcase
            group_id: this.props.data.group_id, //eslint-disable-line camelcase
            last_name: this.state.last, //eslint-disable-line camelcase
            email: this.state.first + '@' + this.state.last + '.com',
            username: this.state.first + '@' + this.state.last + '.com',
            type: 'ADULT'
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST({
                //url: this.props.data._links.users
                url: GLOBALS.API_URL + 'user'
            }, postData).then(res => {
                if (res.response && res.response.user_id) {
                    History.push(`/user/${res.response.user_id}?message=created`);
                }
            }).catch(err => {
                Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused class create', err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    },
    render: function () {
        return (
        <Panel header={HEADINGS.CREATE_USER} className="standard">
            <Form ref="formRef">
                 <Input
                    type="text"
                    value={this.state.first}
                    placeholder="First Name"
                    label="First Name"
                    validate="required"
                    hasFeedback
                    ref="firstInput"
                    onChange={e => this.setState({first: e.target.value})}
                 />
                 <Input
                    type="text"
                    value={this.state.last}
                    placeholder="Last Name"
                    label="Last Name"
                    validate="required"
                    hasFeedback
                    ref="lastInput"
                    onChange={e => this.setState({last: e.target.value})}
                 />
                <Button onClick={this.submitData}> Create </Button>
            </Form>
        </Panel>
        );
    }
});

var mapStateToProps = state => {
    var data = {title: ''};
    var loading = true;
    var currentUser = state.currentUser;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading,
        currentUser
    };
};

var Page = connect(mapStateToProps)(CreateStudent);
export default Page;
