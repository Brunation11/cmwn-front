import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    UPLOAD: 'Data Import'
};

const LABELS = {
    SUBMIT: 'Submit'
}

var Edit = React.createClass({
    organization: {},
    getInitialState: function () {
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
            this.setState({
                code: this.organization.code,
                title: this.organization.title,
                description: this.organization.description
            });
        });
    },
    submitData: function () {
    },
    render: function () {
        return (
           <Layout>
              <Panel header={HEADINGS.EDIT_TITLE} className="standard">
                 <Input
                    type="text"
                    value={this.state.title}
                    placeholder="title"
                    label="Title"
                    bsStyle={Validate.len(this.state.title)}
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
              <Panel header={HEADINGS.UPLOAD} className="standard">
                <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe"></iframe>
                <form method="post" target="dummyframe" action={`${GLOBALS.API_URL}admin/importexcel`} onsubmit={e => e.preventDefault()}>
                    <input type="hidden" name="_token" value={HttpManager.token} />
                    <input type="hidden" name="organization_id" value={this.props.params.id} />
                    <Input type="file" label="Upload Spreadsheet"/>
                    <Button type="submit" >{LABELS.SUBMIT}</Button>
                </form>       
              </Panel>
           </Layout>
         );
    }
});

export default Edit;

