import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
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

import Layout from 'layouts/two_col';

const PAGE_UNIQUE_IDENTIFIER = 'school-edit';

const HEADINGS = {
    EDIT_TITLE: 'Edit School: ',
    UPLOAD: 'Data Import',
    CREATE_CLASS: 'Create a Class in this School'
};

const REFS = {
    TITLE: 'titleInput',
    DESCRIPT: 'descriptionInput',
    FORM: 'formRef',
    CODE: 'codeInput',
    FILE_INPUT: 'fileInput',
    TEACHER_INPUT: 'teacherInput',
    STUDENT_INPUT: 'studentInput',
    TOS_INPUT: 'tosInput'
};

const LABELS = {
    SUBMIT: 'Submit',
    TITLE: 'Title',
    DESCRIPT: 'Description',
    CLASS_NAME: 'Class Name',
    CLASS_CODE: 'Class Code',
    UPLOAD: 'Upload Spreadsheet',
    TEACHER_CODE: 'Teacher Access Code',
    STUDENT_CODE: 'Student Access Code',
    ACCEPT: 'I accept the terms and conditions.'
};

const ERRORS = {
    BAD_UPDATE: 'There was a problem updating your profile. Please try again later.',
    COULDNT_CREATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again',
    NOT_FILLED: 'Please fill out all required fields',
    NO_AGREE: 'You must agree to the terms to submit import.',
    SAME_CODES: 'Teacher and Student access codes must be different',
    PASSW_REQ: 'Passwords must be a minimum of 8 characters and contain a number.',
    NO_FILE: 'Please select an XLSX file to import.'
};

const SUCCESS = {
    IMPORT: 'Import submitted for processing. You will recieve an email once processing is complete.',
    SCHOOL_UPDATE: 'School Updated'
};

const LOG = {
    REFUSE_DIST: 'Server refused district update',
    REFUSE_CLASS: 'Server refused class create'
};

const TERMS_COPY = (
    <span>
        By checking the box below, you agree that you have read, understand and accept the{' '}
            <a href="/terms" target="_blank">Change My World Now Terms and Conditions</a>.
    </span>
);

var checkPerms = function (data) {
    if (data && data.scope && !Util.decodePermissions(data.scope).update) {
        History.push('/school/' + data.group_id);
    }
};

var isPassValid = function (password) {
    return password.length >= 8 && ~password.search(/[0-9]+/);
};

var mapStateToProps;
var Page;

export class ProfileEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            title: '',
            description: ''
        };
    }

    componentWillMount() {
        checkPerms(this.props.data);
        this.setState(this.props.data);
    }

    componentWillReceiveProps(newProps) {
        checkPerms(this.props.data);
        this.setState(newProps.data);
    }

    submitData() {
        var postData = {
            title: this.state.title,
            group_id: this.props.data.group_id, //eslint-disable-line camelcase
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            description: this.state.description
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success(SUCCESS.SCHOOL_UPDATE);
        }).catch(err => {
            Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log(LOG.REFUSE_DIST, err, postData);
        });
    }

    render() {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
              <Panel header={HEADINGS.EDIT_TITLE + this.props.data.title} className="standard">
                  <Link to={`/school/${this.props.data.group_id}/view`}>Return to School Dashboard</Link>
                  <br />
                 <Input
                    type="text"
                    value={this.state.title}
                    placeholder={LABELS.TITLE}
                    label={LABELS.TITLE}
                    bsStyle={Validate.min(3, this.state.title)}
                    hasFeedback
                    ref={REFS.TITLE}
                    onChange={() => this.setState({title: this.refs.titleInput.getValue()}).bind(this)}
                 />
                 <Input
                    type="textarea"
                    value={this.state.description}
                    placeholder={LABELS.DESCRIPT}
                    label={LABELS.DESCRIPT}
                    ref={REFS.DESCRIPT}
                    onChange={() => this.setState({description: this.refs.descriptionInput.getValue()})
                        .bind(this)}
                 />
                 <Button onClick={this.submitData.bind(this)} > Save </Button>
              </Panel>
              {''/*<CreateClass data={this.props.data} />*/}
              <BulkUpload url={this.props.data._links.import.href} />
           </Layout>
         );
    }
}

export class CreateClass extends React.Component { //eslint-disable-line no-unused-vars
    constructor() {
        super();
        this.state = {
            title: ''
        };
    }

    submitData() {
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
                Toast.error(ERRORS.COULDNT_CREATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(LOG.REFUSE_CLASS, err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    }

    render() {
        return (
        <Panel header={HEADINGS.CREATE_CLASS} className="standard">
            <Form ref={REFS.FORM}>
                <Input
                    type="text"
                    value={this.state.title}
                    placeholder={LABELS.CLASS_NAME}
                    label={LABELS.CLASS_NAME}
                    validate="required"
                    ref={REFS.TITLE}
                    name={REFS.TITLE}
                    onChange={e => this.setState({title: e.target.value})}
                />
                <Input
                    type="text"
                    value={this.state.code}
                    placeholder={LABELS.CLASS_CODE}
                    label={LABELS.CLASS_CODE}
                    validate="required"
                    ref={REFS.CODE}
                    name={REFS.CODE}
                    onChange={e => this.setState({code: e.target.value})}
                />
                <Button onClick={this.submitData.bind(this)}> Create </Button>
            </Form>
        </Panel>
        );
    }
}

export class BulkUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            studentCode: '',
            teacherCode: '',
            tos: false
        };
    }

    checkForm(e) {
        try {
            if (!this.refs.formRef.isValid()) {
                e.preventDefault();
                Toast.error(ERRORS.NOT_FILLED);
                return false;
            } else if (this.state.tos === false) {
                e.preventDefault();
                Toast.error(ERRORS.NO_AGREE);
                return false;
            } else if (this.state.teacherCode === this.state.studentCode) {
                e.preventDefault();
                Toast.error(ERRORS.SAME_CODES);
                return false;
            } else if (!isPassValid(this.state.teacherCode) || !isPassValid(this.state.studentCode)) {
                e.preventDefault();
                Toast.error(ERRORS.PASSW_REQ);
                return false;
            } else if (!this.refs.fileInput.getValue()) {
                e.preventDefault();
                Toast.error(ERRORS.NO_FILE);
                return false;
            }
        } catch(err) {
            e.preventDefault();
            return false;
        }
        Toast.success(SUCCESS.IMPORT);
        window.setTimeout(() => {
            this.setState({
                studentCode: '',
                teacherCode: '',
                tos: false
            }).bind(this);
            ReactDOM.findDOMNode(this.refs.fileInput).value = '';
            ReactDOM.findDOMNode(this.refs.fileInput).type = '';
            ReactDOM.findDOMNode(this.refs.fileInput).type = 'file';
            ReactDOM.findDOMNode(this.refs.formRef).reset();
        }, 0);
    }

    render(props) {
        if (this.props.url == null) {
            return null;
        }
        if (props.page.data == null || props.page.data._links.import == null) {
            return null;
        }
        return (
          <Panel header={HEADINGS.UPLOAD} className="standard">
            <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe"></iframe>
            <Form ref={REFS.FORM} method="post" target="dummyframe" encType="multipart/form-data"
                action={this.props.url} onSubmit={e => this.checkForm(e)}>
                <input type="hidden" name="_token" value={HttpManager.token} />
                <input type="hidden" name="type" value="Nyc\DoeImporter" />
                <input type="hidden" name="organization" value={this.props.organization_id} />
                <input type="hidden" name="organization_id" value={this.props.organization_id} />
                <Input ref={REFS.FILE_INPUT} accept=".xlsx" type="file" name="file" chars="40"
                    label={LABELS.UPLOAD}/>
                <Input
                    type="text"
                    value={this.state.teacherCode}
                    placeholder={LABELS.TEACHER_CODE}
                    label={LABELS.TEACHER_CODE}
                    validate="required"
                    ref={REFS.TEACHER_INPUT}
                    name="teacher_code"
                    onChange={e => this.setState({teacherCode: e.target.value}).bind(this)}
                />
                <Input
                    type="text"
                    value={this.state.studentCode}
                    placeholder={LABELS.STUDENT_CODE}
                    label={LABELS.STUDENT_CODE}
                    validate="required"
                    ref={REFS.STUDENT_INPUT}
                    name="student_code"
                    onChange={e => this.setState({studentCode: e.target.value}).bind(this)}
                />
                <FormControls.Static value={TERMS_COPY} />
                <Input
                    type="checkbox"
                    checked={this.state.tos}
                    ref={REFS.TOS_INPUT}
                    label={LABELS.ACCEPT}
                    name="tos"
                    onChange={e => this.setState({tos: e.target.checked}).bind(this)}
                />
                <br />
                <Button type="submit" >{LABELS.SUBMIT}</Button>
            </Form>
          </Panel>
        );
    }
}

mapStateToProps = state => {
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

Page = connect(mapStateToProps)(ProfileEdit);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

