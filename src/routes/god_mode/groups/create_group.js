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
import Shortid from 'shortid';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-create-group';

const HEADINGS = {
    CREATE: 'Create Group',
    ORG: 'Organization',
    PARENT: 'Parent',
    SAVE: 'Save',
    TYPE: 'Type',
    CLICK: 'click',
    HERE: 'here',
    VISIT: 'to visit profile.',
    ANOTHER: 'to create another group.'
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_CREATE = 'There was a problem creating Group. Please try again later.';
const GROUP_CREATE_SUCCESS = 'Group created successfully';
const SERVER_REFUSE = 'Server refused group creation';

var mapStateToProps;
var Page;

export class CreateGroup extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            organization_id: '', //eslint-disable-line camelcase
            parent_id: null, //eslint-disable-line camelcase
            type: '',
            meta: {},
            types: [
                {
                    text: '---',
                    value: null
                },
                {
                    text: 'school',
                    value: 'school'
                },
                {
                    text: 'class',
                    value: 'class'
                }
            ],
            orgs: [
                {
                    text: '---',
                    value: null
                }
            ],
            groups: [
                {
                    text: '---',
                    value: null,
                    organization_id: null //eslint-disable-line camelcase
                }
            ]
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
            meta: meta,
            description: this.state.description,
            organization_id: this.state.organization_id, //eslint-disable-line camelcase
            type: this.state.type,
        };

        if (this.refs.formRef.isValid()) {
            HttpManager.POST(this.props.currentUser._links.group.href, postData).then((res) => {
                Toast.success(GROUP_CREATE_SUCCESS);
                this.setState({group_id: res.response.group_id}); //eslint-disable-line camelcase
            }).catch(err => {
                Toast.error(BAD_CREATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log(SERVER_REFUSE, err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    componentWillReceiveProps(nextProps) {
        var promises = [];
        if (!_.isEmpty(nextProps.currentUser) &&
            nextProps.currentUser._links &&
            nextProps.currentUser._links.group_school &&
            nextProps.currentUser._links.org
        ) {
            promises.push(
                HttpManager.GET({
                    url: nextProps.currentUser._links.group_school.href
                })
            );
            promises.push(
                HttpManager.GET({
                    url: nextProps.currentUser._links.org.href
                })
            );

            Promise.all(promises).then(responses => {
                var groups = {};
                var orgs = {};
                groups[0] = {text: '---', value: null, organization_id: null}; //eslint-disable-line camelcase
                orgs[0] = {text: '---', value: null};
                _.each(responses[0].response._embedded.group, function (group) {
                    groups[group.group_id] = {
                        text: group.title,
                        value: group.group_id,
                        organization_id: group.organization_id //eslint-disable-line camelcase
                    };
                });

                _.each(responses[1].response._embedded.org, function (org) {
                    orgs[org.org_id] = {text: org.title, value: org.org_id};
                });
                this.setState({groups: groups, orgs: orgs, props: nextProps});
            });
        }
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

    renderDropDownOrg() {
        if (this.state.parent_id &&
            this.state.groups[this.state.parent_id] &&
            this.state.groups[this.state.parent_id].organization_id
        ) {
            return (
                <div className="drop-down">
                    <label className="control-label">
                        {`${HEADINGS.ORG}:`}
                    </label>
                    {this.state.orgs[this.state.groups[this.state.parent_id].organization_id].text}

                </div>
            );
        }
        return (
            <div className="drop-down">
                <label className="control-label">
                    {`${HEADINGS.ORG}:`}
                </label>
                <select
                    className="select-options"
                    onChange={e => this.setState({
                        organization_id: e.target.value //eslint-disable-line camelcase
                    })}
                >
                    {_.map(this.state.orgs, function (item){
                        return (<option key={Shortid.generate()} value={item.value}>{item.text}</option>);
                    })}
                </select>
            </div>
        );
    }

    renderDropDownParent() {
        return (
            <div className="drop-down">
                <label className="control-label">
                    {`${HEADINGS.PARENT}:`}
                </label>
                <select
                    className="select-options"
                    onChange={e => {
                        var orgId = null;
                        if (this.state.groups[e.target.value]) {
                            orgId = this.state.groups[e.target.value].organization_id;
                        }
                        this.setState({
                            parent_id: e.target.value, //eslint-disable-line camelcase
                            organization_id: orgId //eslint-disable-line camelcase
                        });
                    }}
                >
                    {_.map(this.state.groups, function (item){
                        return (<option key={Shortid.generate()} value={item.value}>{item.text}</option>);
                    })}
                </select>
            </div>
        );
    }

    renderDropDownType() {
        return (
            <div className="drop-down">
                <label className="control-label">
                    {`${HEADINGS.TYPE}:`}
                </label>
                <select
                    className="select-options"
                    onChange={e => this.setState({type: e.target.value})}
                >
                    {_.map(this.state.types, function (item) {
                        return (<option key={Shortid.generate()} value={item.value}>{item.text}</option>);
                    })}
                </select>
            </div>
        );
    }

    renderGroupFields() {
        return (<div>
            <Form ref="formRef">
                {this.renderDropDownType()}
                {this.renderDropDownParent()}
                {this.renderDropDownOrg()}
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

    renderGroupCreateSuccess() {
        return (
            <div className="standard">
                <p>
                    {`${GROUP_CREATE_SUCCESS}.`} {`${HEADINGS.CLICK} `}
                    <a href={`/${this.state.type}/${this.state.group_id}`}>{`${HEADINGS.HERE} `}</a>
                    {HEADINGS.VISIT}
                </p>
                <p> {HEADINGS.CLICK} <a href="/sa/group/create">{HEADINGS.HERE}</a> {HEADINGS.ANOTHER}</p>
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
                            {this.state.group_id ?
                                this.renderGroupCreateSuccess() :
                                this.renderGroupFields()
                            }
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

Page = connect(mapStateToProps)(CreateGroup);
export default Page;

