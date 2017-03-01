import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Layout from 'layouts/god_mode_two_col';
import Form from 'components/form';
import Log from 'components/log';
import GroupCodeChange from 'components/group_code_change';
import EditMeta from 'components/edit_meta';
import GLOBALS from 'components/globals';
import Address from 'components/address';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-edit-group';

var mapStateToProps;
var Page;

const HEADINGS = {
    EDIT: 'Edit Group: ',
    parent: 'Parent Group',
    organization: 'Organization',
    SAVE: 'Save',
    UPDATE_SUCCESS: 'Group Updated',
    UPDATE_FAILED: 'Server refused Group update',
    ADDRESS_FETCH_FAILED: 'problem retrieving address of group',
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating group profile. Please try again later.';


export class EditGroup extends React.Component {
    constructor(props) {
        super();
        if (_.has(props.data, 'asMutable')){
            this.state = props.data.asMutable();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
        if (this.state && this.state._links && this.state._links.group_address){
            HttpManager.GET(
                this.state._links.group_address.href
            ).then((res) => {
                console.log(res);
                let address = {};
                if (res.response && res.response._embedded && res.response._embedded.address && res.response._embedded.address.length > 0) {
                    this.setState({address: res.response._embedded.address[0]});
                }
            }).catch(err => {
                Toast.error(HEADINGS.ADDRESS_FETCH_FAILED + ' ' + err.message ? err.message : '');
            })
        }
    }

    renderStaticFeild(fieldName, value) {
        return (
            <span className="user-metadata">
                <p className="standard field">{fieldName}: {value}</p>
            </span>
        );
    }

    renderEditableTitle() {
        return (
            <Input
                type="text"
                value={this.state.title}
                placeholder="Title"
                label="Group Title:"
                validate="required"
                ref="titleInput"
                name="titleInput"
                validationEvent="onBlur"
                hasFeedback
                onChange={
                    e => this.setState({
                        title: e.target.value
                    })
                }
            />
        );
    }

    renderEditableDescription() {
        return (
            <Input
                type="text"
                value={this.state.description}
                placeholder="Description"
                label="Description:"
                validate="required"
                ref="descriptionInput"
                name="descriptionInput"
                validationEvent="onBlur"
                hasFeedback
                onChange={
                    e => this.setState({
                        description: e.target.value
                    })
                }
            />
        );
    }

    renderEntity(name) {
        var value = this.state[name + '_id'];

        if (this.state[name] && this.state[name] !== null && this.state[name].title !== null) {
            value = this.state[name].title;
        }

        if (value !== null) {
            return (this.renderStaticFeild(HEADINGS[name], value));
        }
    }

    renderGroupFields() {
        return (<div>
            <Form ref="formRef">
                {this.renderStaticFeild('Group Type', this.state.type)}
                {this.renderEntity('parent')}
                {this.renderEntity('organization')}
                {this.renderEditableTitle()}
                {this.renderEditableDescription()}
            </Form>
                <EditMeta ref="meta" data={this.state.meta}/>
                <br/>
                <br/>
                <Button className="green standard left"
                        onClick={this.submitData.bind(this)}>
                        {HEADINGS.SAVE}
                </Button>
            </div>
        );
    }

    submitData() {
        var meta = this.refs.meta.getMeta();
        var postData;

        if (meta === 'forbid_submit') {
            return;
        }
        postData = {
            title: this.state.title,
            meta: meta,
            description: this.state.description,
            organization_id: this.state.organization_id, //eslint-disable-line camelcase
            type: this.state.type,
        };

        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(this.state._links.self.href, postData).then((res) => {
                Toast.success(HEADINGS.UPDATE_SUCCESS);
                this.setState(res.response);
            }).catch(err => {
                Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(HEADINGS.UPDATE_FAILED, err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    render() {
        if (this.state === null || _.isEmpty(this.state)) return null;
        console.log(this.state.address)
        return (
            <Layout
                currentUser={this.props.currentUser}
                navMenuId="navMenu"
            >
                <div className="god-edit-group">
                    <Panel header={`${HEADINGS.EDIT} ${this.state.title}`}
                        className="standard"
                    >
                        <div className="center">
                            {this.renderGroupFields()}
                        </div>
                    </Panel>
                    <GroupCodeChange currentUser={this.props.currentUser} data={this.state}/>
                    <Address
                        currentUser={this.props.currentUser}
                        data={this.state.address ? this.state.address : null}
                        links={this.state._links}
                    />
                </div>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};

    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        data,
        state,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(EditGroup);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
