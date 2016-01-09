import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import History from 'components/history';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created'
};
const BREADCRUMB = {
    HOME: 'Home',
    DISTRICTS: 'Districts'
};
const EDIT_LINK = 'Edit';


var View = React.createClass({
    componentWillMount: function () {
        this.district = {};
        this.getDistrict();
    },
    getDistrict: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts/' + this.props.params.id});
        urlData.then(res => {
            this.district = res.response.data;
            if (!this.district.can_update) { //eslint-disable-line camel_case
                History.replaceState(null, `/district/${this.props.params.id}/profile`);
            }
            this.forceUpdate();
        });
    },
    renderEditLink: function () {
        if (GLOBALS.CURRENT_USER.ID === window.parseInt(this.props.params.id)) {
            /** @TODO MPR, 10/4/15: Add check for user is admin*/
            return <Link to={`/district/${this.props.params.id}/edit`} >({EDIT_LINK})</Link>;
        }
        return null;
    },
    render: function () {
        if (this.state.district == null || !this.state.district.can_update) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.district.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/districts">{BREADCRUMB.DISTRICTS}</Link>
                    <span>{this.district.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <p>
                        {this.renderEditLink()}
                    </p>
                    <br />
                    <p>{`${HEADINGS.ID}: ${this.district.id}`}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.district.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.district.created_at}`}</p>
                </Panel>
           </Layout>
        );
    }
});

export default View;

