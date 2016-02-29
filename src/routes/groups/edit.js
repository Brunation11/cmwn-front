import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import GLOBALS from 'components/globals';
import History from 'components/history';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Info'
};
const BREADCRUMB = {
    HOME: 'Home',
    GROUPS: 'Groups'
};

const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

var Edit = React.createClass({
    getInitialState: function () {
        this.group = {};
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        this.getGroup();
    },
    getGroup: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'groups/' + this.props.params.id});
        urlData.then(res => {
            this.group = res.response.data;
            if (!this.group.can_update) { //eslint-disable-line camel_case
                History.replace(`/groups/${this.props.params.id}/profile`);
            }
            this.setState(this.group);
        });
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            description: this.state.description
        };
        HttpManager.POST(`${GLOBALS.API_URL}groups/${this.state.uuid}`, postData).then(() => {
            Toast.success('District Updated');
        }).catch(err => {
            Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused district update', err, postData);
        });
    },
    render: function () {
        if (this.group == null || !this.group.can_update) {
            return null;
        }
        return (
           <Layout>
                <h2>{this.group.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/groups">{BREADCRUMB.GROUPS}</Link>
                    <span>{this.group.title}</span>
                </div>
              <Panel header={HEADINGS.EDIT_TITLE} className="standard">
                 <Input
                    type="text"
                    value={this.state.title}
                    placeholder="title"
                    label="Title"
                    validate="required"
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
           </Layout>
         );
    }
});

export default Edit;

