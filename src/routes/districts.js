import React from 'react';
import _ from 'lodash';

//import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Fetcher from 'components/fetcher';

const TITLE = 'Districts';
const CREATE_TEXT = 'Create District';

var Districs = React.createClass({
    renderCreateDistrict: function () {
        if (!this.isSuperAdmin) {
            return null;
        }
        return (
            <p><a href={'/districts/create'}>{CREATE_TEXT}</a></p>
        );
    },
    render: function () {
        return (
            <Layout>
                <header>
                    <h2>{TITLE}</h2>
                    <div >
                        {this.renderCreateDistrict()}
                    </div>
                </header>
                <Fetcher url={GLOBALS.API_URL + 'districts'} transform={data => {
                    //sure exploiting this side effect in a render method is filthy but its also easy
                    var wasSuper = this.isSuperAdmin;
                    this.isSuperAdmin = _.reduce(data, (a, i) => a && i.can_update, true);
                    if (wasSuper !== this.isSuperAdmin) {
                         window.setTimeout(() => this.forceUpdate(), 0);
                    }
                    return data;
                }}>
                    <Paginator pageCount={1}>
                        <Table>
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a href={`/district/${row.uuid}`}>{_.startCase(data)}</a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="created_at" renderHeader="Created" />
                            <Column dataKey="updated_at" renderHeader="Last Updated"
                                renderCell={data => (data == null ? 'never' : data)}
                            />
                        </Table>
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Districs;

