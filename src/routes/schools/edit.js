import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import {Link} from 'react-router';
import {Button, Input, Panel, FormControls} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import DropdownDatepicker from 'components/dropdown_datepicker';
import Validate from 'components/validators';
import Log from 'components/log';
import Toast from 'components/toast';
import Form from 'components/form';
import Util from 'components/util';
import History from 'components/history';
import GroupCodeChange from 'components/group_code_change';

import Layout from 'layouts/two_col';

import 'routes/schools/edit.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'school-edit';

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
    TOS_INPUT: 'tosInput',
    START_DATE_SELECTED: 'startDateSelected',
    START_DATE: 'startDate'
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
    ACCEPT: 'I accept the terms and conditions.',
    START_DATE_SELECTED: 'Delay account activity start date',
    START_DATE: 'Start Date'
};

export const ERRORS = {
    BAD_UPDATE: 'There was a problem updating your profile. Please try again later.',
    COULDNT_CREATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again',
    NOT_FILLED: 'Please fill out all required fields',
    NO_AGREE: 'You must agree to the terms to submit import.',
    SAME_CODES: 'Teacher and Student access codes must be different',
    PASSW_REQ: 'Passwords must be a minimum of 8 characters and contain a number.',
    NO_FILE: 'Please select an XLSX file to import.'
};

export const SUCCESS = {
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

const UPLOAD_RECIEVED_LABEL = 'Upload Recieved Status:';

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

export class SchoolEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            title: '',
            description: '',
            startdateselected: false
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
            description: this.state.description,
            type: this.state.type
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success(SUCCESS.SCHOOL_UPDATE);
        }).catch(err => {
            Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log(LOG.REFUSE_DIST, err, postData);
        });
    }

    render() {
        var bulkUpload = null;
        if (this.props.data == null || this.props.data.group_id == null ||
            !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        const SCHOOL_EDIT = (
            <Panel header={HEADINGS.EDIT_TITLE + this.props.data.title} className="standard">
                <Link to={'/school/' + this.props.data.group_id + '/view'} id="school-return-dash">
                    Return to School Dashboard
                </Link>
                <br />
                <Input
                    type="text"
                    value={this.state.title}
                    placeholder={LABELS.TITLE}
                    label={LABELS.TITLE}
                    bsStyle={Validate.min(3, this.state.title)}
                    hasFeedback
                    ref={REFS.TITLE}
                    id="school-edit-name"
                    onChange={() => this.setState({title: this.refs.titleInput.getValue()})}
                />
                <Input
                    type="textarea"
                    value={this.state.description}
                    placeholder={LABELS.DESCRIPT}
                    label={LABELS.DESCRIPT}
                    ref={REFS.DESCRIPT}
                    id="school-edit-description"
                    onChange={() => this.setState({description: this.refs.descriptionInput.getValue()})}
                />
                <Button onClick={this.submitData.bind(this)} > Save </Button><br/><br/>
            </Panel>
        );
        if (this.props.data._links.import) {
            bulkUpload = (<BulkUpload data={this.props.data} url={this.props.data._links.import.href} />);
        }

        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
                {SCHOOL_EDIT}
                <GroupCodeChange currentUser={this.props.currentUser} data={this.props.data}/>
                {''/*<CreateClass data={this.props.data} />*/}
                {bulkUpload}
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
            tos: false,
            open: false,
            startdateselected: false,
            startDate: Date.now()
        };
    }

    checkForm(e) {
        var result = SUCCESS.IMPORT;
        try {
            if (!this.refs.formRef.isValid()) {
                e.preventDefault();
                result = ERRORS.NOT_FILLED;
                Toast.error(result);
            } else if (this.state.tos === false) {
                e.preventDefault();
                result = ERRORS.NO_AGREE;
                Toast.error(result);
            } else if (this.state.teacherCode === this.state.studentCode) {
                e.preventDefault();
                result = ERRORS.SAME_CODES;
                Toast.error(result);
            } else if (!isPassValid(this.state.teacherCode) || !isPassValid(this.state.studentCode)) {
                e.preventDefault();
                result = ERRORS.PASSW_REQ;
                Toast.error(result);
            } else if (!this.refs.fileInput.getValue()) {
                e.preventDefault();
                result = ERRORS.NO_FILE;
                Toast.error(result);
            }
        } catch(err) {
            e.preventDefault();
        }
        Toast.success(result);
        window.setTimeout(() => {
            this.setState({
                studentCode: '',
                teacherCode: '',
                tos: false,
                open: true
            });
            ReactDOM.findDOMNode(this.refs.fileInput).value = '';
            ReactDOM.findDOMNode(this.refs.fileInput).type = '';
            ReactDOM.findDOMNode(this.refs.fileInput).type = 'file';
            ReactDOM.findDOMNode(this.refs.formRef).reset();
        }, 0);
        return result;
    }
    renderStartDate(){
        if (!this.state.startdateselected) return null;
        return (
            <DropdownDatepicker
                label={LABELS.START_DATE}
                ref={REFS.START_DATE}
                value={this.state.startDate}
                name="code_start"
                future={true}
                hasFeedback
                onChange={
                    date => {
                        this.setState({
                            startDate: date,
                        });
                    }
                }
            />
        );
    }

    render() {
        if (this.props.data == null || this.props.data._links.import == null) {
            return null;
        }
        return (
          <Panel header={HEADINGS.UPLOAD} className="school-import standard">
            <div className={ClassNames('upload-status', {open: this.state.open})} >
                <span className="statuslabel" >{UPLOAD_RECIEVED_LABEL}</span>
                <iframe
                    height="200"
                    border="0"
                    name="dummyframe"
                    className="dummyframe"
                    id="dummyframe"
                    >
                </iframe>
            </div>
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
                    id="teacher-code"
                    onChange={e => this.setState({teacherCode: e.target.value})}
                />
                <Input
                    type="text"
                    value={this.state.studentCode}
                    placeholder={LABELS.STUDENT_CODE}
                    label={LABELS.STUDENT_CODE}
                    validate="required"
                    ref={REFS.STUDENT_INPUT}
                    name="student_code"
                    id="student-code"
                    onChange={e => this.setState({studentCode: e.target.value})}
                />
                <Input
                    type="checkbox"
                    checked={this.state.startdateselected}
                    ref={REFS.START_DATE_SELECTED}
                    label={LABELS.START_DATE_SELECTED}
                    name="startdate"
                    onChange={e => this.setState({startdateselected: e.target.checked})}
                />
                {this.renderStartDate()}
                <FormControls.Static value={TERMS_COPY} />
                <Input
                    type="checkbox"
                    checked={this.state.tos}
                    ref={REFS.TOS_INPUT}
                    label={LABELS.ACCEPT}
                    name="tos"
                    id="import-terms-check"
                    onChange={e => this.setState({tos: e.target.checked})}
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

Page = connect(mapStateToProps)(SchoolEdit);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

