import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import History from 'components/history';

const TITLE = 'Districts';
const CREATE_TEXT = 'Create District';

var Component = React.createClass({
    renderCreateDistrict: function () {
        //if (!this.isSuperAdmin) {
        //    return null;
        //}
        return (
            <p><a href={'/districts/create'}>{CREATE_TEXT}</a></p>
        );
    },
    render: function () {
        /** @TODO MPR, 3/8/16: Actually check superuser */
        /*data => {
                    //sure exploiting this side effect in a render method is filthy but its also easy
                    var wasSuper = this.isSuperAdmin;
                    this.isSuperAdmin = _.reduce(data, (a, i) => a && i.can_update, true);
                    if (wasSuper !== this.isSuperAdmin) {
                        window.setTimeout(() => this.forceUpdate(), 0);
                    }
                    return data;
                }*/
        return (
            <Layout>
                <header>
                    <h2>{TITLE}</h2>
                    <div >
                        {this.renderCreateDistrict()}
                    </div>
                </header>
                <Paginator pageCount={1} data={this.props.data}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a onClick={() => History.push('/districts/' + row.org_id)}>{_.startCase(data)}</a>
                            )}
                        />
                        <Column dataKey="description" />
                        <Column dataKey="created_at" renderHeader="Created" />
                        <Column dataKey="updated_at" renderHeader="Last Updated"
                            renderCell={data => (data == null ? 'never' : data)}
                        />
                    </Table>
                </Paginator>
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.org) {
        loading = state.page.loading;
        data = state.page.data._embedded.org;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

