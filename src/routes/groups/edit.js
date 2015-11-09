import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';

const HEADINGS = {
    EDIT_TITLE: 'Info'
};
const BREADCRUMB = {
    HOME: 'Home',
    GROUPS: 'Groups'
};

/** @TODO MPR, 11/4/15: Probably these validation rules should be stored elsewhere */
/**
 * Private Function. Must always be called with call or apply
 */
var _nameValidation = function () {
    var length = this.state.title.length;
    if (length < 3) {
        return 'error';
    }
    return 'success';
};

var Edit = React.createClass({
    group: {},
    getInitialState: function () {
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
            this.setState({
                code: this.group.code,
                title: this.group.title,
                description: this.group.description
            });
        });
    },
    submitData: function () {
    },
    render: function () {
        if (this.group.length === 0) {
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
                    bsStyle={_nameValidation.call(this)}
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

