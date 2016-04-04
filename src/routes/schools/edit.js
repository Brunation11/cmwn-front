import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Panel, FormControls} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import Log from 'components/log';
import Toast from 'components/toast';
import Form from 'components/form';
import Util from 'components/util';
import History from 'components/history';
import Store from 'components/store';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Edit School: ',
    UPLOAD: 'Data Import',
    CREATE_CLASS: 'Create a Class in this School'
};

const LABELS = {
    SUBMIT: 'Submit'
};

const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

const ERRORS = {
    BAD_UPDATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

const TERMS_COPY = <span>By checking the box below, you agree that you have read, understand, and accept <a href="/terms" target="_blank">ChangeMyWorldNow.com's terms and conditions</a>.</span>;

var checkPerms = function (data) {
    if (data && data.scope && !Util.decodePermissions(data.scope).update) {
        History.push('/school/' + data.group_id);
    }
};

var isPassValid = function (password) {
    return password.length >= 8 && ~password.search(/[0-9]+/);
};

var Component = React.createClass({
    getInitialState: function () {
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        checkPerms(this.props.data);
        this.setState(this.props.data);
    },
    componentWillReceiveProps: function (newProps) {
        checkPerms(this.props.data);
        this.setState(newProps.data);
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            group_id: this.props.data.group_id, //eslint-disable-line camelcase
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            description: this.state.description
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success('School Updated');
        }).catch(err => {
            Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused district update', err, postData);
        });
    },
    render: function () {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout>
              <Panel header={HEADINGS.EDIT_TITLE + this.props.data.title} className="standard">
                 <Input
                    type="text"
                    value={this.state.title}
                    placeholder="title"
                    label="Title"
                    bsStyle={Validate.min(3, this.state.title)}
                    hasFeedback
                    ref="titleInput"
                    onChange={() => this.setState({title: this.refs.titleInput.getValue()})}
                 />
                 <Input
                    type="textarea"
                    value={this.state.description}
                    placeholder="description"
                    label="Description"
                    ref="descriptionInput"
                    onChange={() => this.setState({description: this.refs.descriptionInput.getValue()})}
                 />
                 <Button onClick={this.submitData} > Save </Button>
              </Panel>
              {''/*<CreateClass data={this.props.data} />*/}
              <BulkUpload url={this.props.data._links.import.href} />
           </Layout>
         );
    }
});

var CreateClass = React.createClass({ //eslint-disable-line no-unused-vars
    getInitialState: function () {
        return {
            title: ''
        };
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            parent_id: this.props.data.group_id, //eslint-disable-line camelcase
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            meta: {
                code: this.state.code
            },
            description: this.state.title,
            type: 'class'
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST({
                //url: this.props.data._links['group:class']
                url: GLOBALS.API_URL + 'group'
            }, postData).then(res => {
                if (res.response && res.response.group_id) {
                    History.push(`/class/${res.response.group_id}?message=created`);
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
        <Panel header={HEADINGS.CREATE_CLASS} className="standard">
            <Form ref="formRef">
                <Input
                    type="text"
                    value={this.state.title}
                    placeholder="Class Name"
                    label="Class Name"
                    validate="required"
                    ref="titleInput"
                    name="titleInput"
                    onChange={e => this.setState({title: e.target.value})} //eslint-disable-line camelcase
                />
                <Input
                    type="text"
                    value={this.state.code}
                    placeholder="Class Code"
                    label="Class Code"
                    validate="required"
                    ref="codeInput"
                    name="codeInput"
                    onChange={e => this.setState({code: e.target.value})} //eslint-disable-line camelcase
                />
                <Button onClick={this.submitData}> Create </Button>
            </Form>
        </Panel>
        );
    }
});

var BulkUpload = React.createClass({
    getInitialState: function () {
        return {
            studentCode: '',
            teacherCode: '',
            tos: false
        };
    },
    render: function () {
        var state = Store.getState();
        if (this.props.url == null) {
            return null;
        }
        if (!state.currentUser || !state.currentUser._embedded || !state.currentUser._embedded.groups || !state.currentUser._embedded.groups.length || state.currentUser._embedded.groups._links.import == null) {
            return null;
        }
        return (
          <Panel header={HEADINGS.UPLOAD} className="standard">
            <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe"></iframe>
            <Form ref="formRef" method="post" target="dummyframe" encType="multipart/form-data" action={this.props.url}
                onSubmit={e => {
                    try {
                        if (!this.refs.formRef.isValid()) {
                            e.preventDefault();
                            Toast.error('Please fill out all required fields');
                            return false;
                        } else if (this.state.tos === false) {
                            e.preventDefault();
                            Toast.error('You must agree to the terms to submit import.');
                            return false;
                        } else if (this.state.teacherCode === this.state.studentCode) {
                            e.preventDefault();
                            Toast.error('Teacher and Student access codes must be different');
                            return false;
                        } else if (!isPassValid(this.state.teacherCode) || !isPassValid(this.state.studentCode)) {
                            e.preventDefault();
                            Toast.error('Passwords must be a minimum of 8 characters and contain a number.');
                            return false;
                        } else if (!this.refs.fileInput.getValue()) {
                            e.preventDefault();
                            Toast.error('Please select an XLSX file to import.');
                            return false;
                        }
                    } catch(err) {
                        e.preventDefault();
                        return false;
                    }
                    Toast.success('Import submitted for processing. You will recieve an email once processing is complete.');
                    window.setTimeout(() => {
                        this.setState({
                            studentCode: '',
                            teacherCode: '',
                            tos: false
                        });
                        ReactDOM.findDOMNode(this.refs.fileInput).value = '';
                        ReactDOM.findDOMNode(this.refs.fileInput).type = '';
                        ReactDOM.findDOMNode(this.refs.fileInput).type = 'file';
                        ReactDOM.findDOMNode(this.refs.formRef).reset();
                    }, 0);
                }}
            >
                <input type="hidden" name="_token" value={HttpManager.token} />
                <input type="hidden" name="type" value="Nyc\DoeImporter" />
                <input type="hidden" name="organization" value={this.props.organization_id} />
                <input type="hidden" name="organization_id" value={this.props.organization_id} />
                <Input ref="fileInput" accept=".xlsx" type="file" name="file" chars="40" label="Upload Spreadsheet"/>
                <Input
                    type="text"
                    value={this.state.teacherCode}
                    placeholder="Teacher Access Code"
                    label="Teacher Access Code"
                    validate="required"
                    ref="teacherInput"
                    name="teacher_code"
                    onChange={e => this.setState({teacherCode: e.target.value})} //eslint-disable-line camelcase
                />
                <Input
                    type="text"
                    value={this.state.studentCode}
                    placeholder="Student Access Code"
                    label="Student Access Code"
                    validate="required"
                    ref="studentInput"
                    name="student_code"
                    onChange={e => this.setState({studentCode: e.target.value})} //eslint-disable-line camelcase
                />
                <FormControls.Static value={TERMS_COPY} />
                <Input
                    type="checkbox"
                    checked={this.state.tos}
                    ref="tosInput"
                    label="I accept the terms and conditions."
                    name="tos"
                    onChange={e => this.setState({tos: e.target.checked})} //eslint-disable-line camelcase
                />
                <br />
                <Button type="submit" >{LABELS.SUBMIT}</Button>
            </Form>
          </Panel>
        );
    }
});

const mapStateToProps = state => {
    var data = {title: ''};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

