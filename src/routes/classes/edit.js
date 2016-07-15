import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import Util from 'components/util';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Edit Class: ',
};

const BAD_CLASS_UPDATE = 'There was a problem updating your class. Please try again later.';

export class EditClass extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            title: '',
            description: ''
        };
    }
    componentWillMount() {
        this.setState(this.props.data);
    }
    componentWillReceiveProps(newProps) {
        this.setState(newProps.data);
    }
    submitData() {
        var postData = {
            title: this.state.title,
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            description: this.state.description
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success('Class Updated');
        }).catch(err => {
            Toast.error(BAD_CLASS_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused class update', err, postData);
        });
    }
    render() {
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
                    onChange={e => this.setState(
                        {description: e.target.value} //eslint-disable-line camelcase
                    )}
                />
                 <Button id="save-button" onClick={this.submitData.bind(this)} > Save </Button>
              </Panel>
           </Layout>
         );
    }
}

var mapStateToProps = state => { // eslint-disable-line vars-on-top
    var data = {title: ''};
    var loading = true;
    var currentUser = state.currentUser;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading,
        currentUser
    };
};

var Page = connect(mapStateToProps)(EditClass); // eslint-disable-line vars-on-top
export default Page;
