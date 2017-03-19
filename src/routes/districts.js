import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'moment';

import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';

import Layout from 'layouts/two_col';

const TITLE = 'My Districts';
const CREATE_TEXT = 'Create District';

var mapStateToProps;
var Page;

export class District extends React.Component{
    renderCreateDistrict(){
        if (this.props.currentUser.scope === -1) {
            return (
                <p><a href={'/districts/create'}>{CREATE_TEXT}</a></p>
            );
        }
        return null;
    }
    render() {
        return (
            <Layout currentUser={this.props.currentUser} className="district-list">
                <Panel header={TITLE} className="standard" >
                    <div >
                        {this.renderCreateDistrict()}
                    </div>
                    <Paginator data={this.props.data}>
                        <Table data={this.props.data} className="admin">
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <Link to={'/districts/' + row.org_id} className="district-link">
                                        {_.startCase(data)}
                                    </Link>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column
                                dataKey="created"
                                renderHeader="Created"
                                renderCell={created => (
                                    _.get(created, 'date') ?
                                    Moment(created.date).format('MM/DD/YYYY h:mm a') :
                                    (created !== null ? Moment(created).format('MM/DD/YYYY h:mm a') : '-')
                                )}
                            />
                            <Column
                                dataKey="updated"
                                renderHeader="Last Updated"
                                renderCell={updated => (
                                    _.get(updated, 'date') ?
                                    Moment(updated.date).format('MM/DD/YYYY h:mm a') :
                                    (updated !== null ? Moment(updated).format('MM/DD/YYYY h:mm a') : 'never')
                                )}
                            />
                        </Table>
                    </Paginator>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.org) {
        loading = state.page.loading;
        data = state.page.data._embedded.org;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(District);
export default Page;

