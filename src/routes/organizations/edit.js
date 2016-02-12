import React from 'react';
import {Button, Input, Panel, FormControls} from 'react-bootstrap';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import History from 'components/history';
import Form from 'components/form';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    UPLOAD: 'Data Import'
};

const LABELS = {
    SUBMIT: 'Submit'
};

const TERMS_COPY = <span>By checking the box below, you agree that you have read, understand, and accept <a href="/terms" target="_blank">ChangeMyWorldNow.com's terms and conditions</a>.</span>;

var Edit = React.createClass({
    getInitialState: function () {
        this.organization = {};
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        this.getOrganization();
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations/' + this.props.params.id});
        urlData.then(res => {
            this.organization = res.response.data;
            if (!res.response.data.can_update) { //eslint-disable-line camel_case
                History.replaceState(null, `/organization/${this.props.params.id}/profile`);
            }
            this.setState(this.organization);
        });
    },
    submitData: function () {
    },
    render: function () {
        if (this.state.uuid == null || !this.state.can_update) {
            return null;
        }
        return (
           <Layout>
              <Panel header={HEADINGS.EDIT_TITLE} className="standard">
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
              <BulkUpload orgId={this.props.params.id}/>
           </Layout>
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
        return (
          <Panel header={HEADINGS.UPLOAD} className="standard">
            <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe"></iframe>
            <Form ref="formRef" method="post" target="dummyframe" encType="multipart/form-data" action={`${GLOBALS.API_URL}admin/importexcel`}
                onsubmit={e => {
                    try {
                        e.preventDefault();
                    } catch (err) {
                        return false;
                    }
                }}
            >
                <input type="hidden" name="_token" value={HttpManager.token} />
                <input type="hidden" name="organizations" value={this.props.orgId} />
                <input type="hidden" name="organization_id" value={this.props.orgId} />
                <Input type="file" name="yourcsv" chars="40" label="Upload Spreadsheet"/>
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
                    onChange={e => this.setState({tos: e.target.value})} //eslint-disable-line camelcase
                />
                <br />
                <Button type="submit" >{LABELS.SUBMIT}</Button>
            </Form>
          </Panel>
        );
    }
});

export default Edit;

