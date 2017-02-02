import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Layout from 'layouts/god_mode_two_col';
import Form from 'components/form';
import Log from 'components/log';
import EditMeta from 'components/edit_meta';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-edit-org';

var mapStateToProps;
var Page;

const HEADINGS = {
    EDIT: 'Edit Organization: ',
    SAVE: 'Save',
    TYPE: 'Type'
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating organization profile. Please try again later.';
const UPDATED = 'Organization Updated';
const REFUSE_UPDATE = 'Server refused organization update';


export class EditOrg extends React.Component {
    constructor(props) {
        super();
        if (_.has(props.data, 'asMutable')){
            this.state = props.data.asMutable();
        }
        this.state.types = [
            {
                text: 'district',
                value: 'district'
            },
            {
                text: 'club',
                value: 'club'
            }
        ];
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
    }

    shouldComponentUpdate() {
        return (true);
    }

    renderDropDownType() {
        return (
            <div className="drop-down">
                <label className="control-label">
                    {`${HEADINGS.TYPE}:`}
                </label>
                <br/>
                <select
                    defaultValue={this.state.type}
                    className="select-options"
                    onChange={e => this.setState({type: e.target.value})}
                >
                    {_.map(this.state.types, function (item) {
                        return (<option key={item.text} value={item.value}>{item.text}</option>);
                    })}
                </select>
                <br/><br/>
            </div>
        );
    }

    renderEditableTitle() {
        return (
            <Input
                type="text"
                value={this.state.title}
                placeholder="Title"
                label="Organization Title:"
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

    renderOrgFields() {
        return (<div>
            <Form ref="formRef">
                {this.renderDropDownType()}
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
            type: this.state.type,
        };

        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(this.state._links.self.href, postData).then((res) => {
                Toast.success(UPDATED);
                this.setState(res.response);
            }).catch(err => {
                Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(REFUSE_UPDATE, err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    render() {
        if (this.state === null || _.isEmpty(this.state)) return null;

        return (
            <Layout
                currentUser={this.props.currentUser}
                navMenuId="navMenu"
            >
                <div className="god-create">
                    <Panel header={`${HEADINGS.EDIT} ${this.state.title}`}
                        className="standard"
                    >
                        <div className="center">
                            {this.renderOrgFields()}
                        </div>
                    </Panel>
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

Page = connect(mapStateToProps)(EditOrg);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
