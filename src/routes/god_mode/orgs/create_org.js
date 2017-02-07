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
import 'routes/god_mode/groups/create_group.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-create-org';

const HEADINGS = {
    CREATE: 'Create Group',
    SAVE: 'Save',
    TYPE: 'Type',
    CLICK: 'Click',
    HERE: 'here',
    VISIT: 'to visit profile.',
    ANOTHER: 'to create another group.'
};


const ORG_CREATE_SUCCESS = 'Organization created successfully';
const SERVER_REFUSE = 'Server refused organization creation';

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const INVALID_TYPE = 'Please select one of the types from the drop-down menu';
const BAD_CREATE = 'There was a problem creating Organization. Please try again later.';

var mapStateToProps;
var Page;

export class CreateOrg extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            org_id: '', //eslint-disable-line camelcase
            type: '',
            meta: {},
            types: [
                {
                    text: '---',
                    value: null
                },
                {
                    text: 'district',
                    value: 'district'
                },
                {
                    text: 'club',
                    value: 'club'
                }
            ],
        };
    }

    submitData() {
        var meta = this.refs.meta.getMeta();
        var postData;

        if (meta === 'forbid_submit') {
            return;
        }

        postData = {
            title: this.state.title,
            meta,
            description: this.state.description,
            organization_id: this.state.organization_id, //eslint-disable-line camelcase
            type: this.state.type,
        };

        if (this.refs.formRef.isValid() && this.state.type) {
            HttpManager.POST(this.props.currentUser._links.org.href, postData).then((res) => {
                Toast.success(ORG_CREATE_SUCCESS);
                this.setState({org_id: res.response.org_id}); //eslint-disable-line camelcase
            }).catch(err => {
                Toast.error(BAD_CREATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(SERVER_REFUSE, err, postData);
            });
        } else {
            if (!this.state.type) {
                Toast.error(INVALID_TYPE);
            } else {
                Toast.error(INVALID_SUBMISSION);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({props: nextProps});
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

    renderDropDownType() {
        return (
            <div className="drop-down">
                <label className="control-label">
                    {HEADINGS.TYPE}
                </label>
                <select
                    className="select-options"
                    onChange={e => this.setState({type: e.target.value})}
                >
                    {_.map(this.state.types, function (item) {
                        return (<option value={item.value}>{item.text}</option>);
                    })}
                </select>
            </div>
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
                        {`${HEADINGS.SAVE}`}
                </Button>
            </div>
        );
    }

    renderOrgCreateSuccess() {
        return (
            <div className="standard">
                <p> {`${ORG_CREATE_SUCCESS}. `}
                    {HEADINGS.CLICK} <a href={`/district/${this.state.org_id}`}>{HEADINGS.HERE}</a>
                    {HEADINGS.VISIT}
                </p>
                <p> {HEADINGS.CLICK} <a href="/sa/org/create">{HEADINGS.HERE}</a> {HEADINGS.ANOTHER}</p>
            </div>
        );
    }

    render() {
        if (this.state === null || _.isEmpty(this.state)) return null;

        return (
            <Layout currentUser={this.props.currentUser} navMenuId="navMenu">
                <div className="god-create">
                    <Panel header={`${HEADINGS.CREATE}`}
                        className="standard"
                    >
                        <div className="center">
                            {this.state.org_id ? this.renderOrgCreateSuccess() : this.renderOrgFields()}
                        </div>
                    </Panel>
                </div>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var currentUser = {};
    var loading = true;

    if (state.page) {
        loading = state.page.loading;
    }

    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(CreateOrg);
export default Page;

