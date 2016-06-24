import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Form from 'components/form';
import Toast from 'components/toast';
import Util from 'components/util';
import History from 'components/history';
import GLOBALS from 'components/globals';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Edit Class: ',
    CREATE_USER: 'Create User in this Class'
};

const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

const ERRORS = {
    BAD_UPDATE: 'Could not create user. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

export class EditClass extends React.Component {
    constructor (props) {
        super(props);
        this.state =  {
            code: '',
            title: '',
            description: ''
        };
    }
    componentWillMount () {
        this.setState(this.props.data);
    }
    componentWillReceiveProps (newProps) {
        this.setState(newProps.data);
    }
    submitData () {
        var postData = {
            title: this.state.title,
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            description: this.state.description
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success('Class Updated');
        }).catch(err => {
            Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused district update', err, postData);
        });
    }
    render () {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout>
              <Panel header={HEADINGS.EDIT_TITLE + this.props.data.title} className="standard">
                <Link to={'/class/' + this.props.data.group_id + '/view'}>Return to Class Dashboard</Link>
                <br />
                <Input
                    id="class-name"
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
                    id="descript"
                    type="text"
                    value={this.state.description}
                    placeholder="Description"
                    label="Description"
                    validate="required"
                    ref="codeInput"
                    name="codeInput"
                    onChange={e => this.setState({description: e.target.value})} //eslint-disable-line camelcase
                />
                 <Button id="save-button" onClick={this.submitData.bind(this)} > Save </Button>
              </Panel>
              <CreateStudent data={this.props.data}/>
           </Layout>
         );
    }
};

export class CreateStudent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            title: ''
        };
    }
    submitData () {
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
    }
    render () {
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
                <Button onClick={this.submitData.bind(this)}> Create </Button>
            </Form>
        </Panel>
        );
    }
};

var mapStateToProps = state => {
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

var Page = connect(mapStateToProps)(EditClass);
export default Page;

