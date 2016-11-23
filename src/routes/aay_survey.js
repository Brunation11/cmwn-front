import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import SurveyModal from 'components/survey_modal';
import HttpManager from 'components/http_manager';
import _ from 'lodash';

const PAGE_UNIQUE_IDENTIFIER = 'aay-survey-view';

const HEADINGS = {
    TITLE: 'All About You Survey Results',
    USER: 'User',
    DATA: 'Survey Result',
    NODATA: 'No Survey Data To Display At This Time'
};

var mapStateToProps;
var Page;

export class AAYView extends React.Component {
    constructor() {
        super();
        this.userTableData = {};
    }

    componentWillReceiveProps(nextProps) {
        var userPromises;
        if (nextProps.data.length === 0) return;

        userPromises = _.map(nextProps.data, (item) => {
            var link = nextProps.links.split('/')[2];
            return HttpManager.GET({
                url: `https://${link}/user/${item.user_id}`
            });
        });

        Promise.all(userPromises).then(allUserData => {
            _.each(allUserData, userResponse => {
                this.userTableData[userResponse.response.user_id] = userResponse.response.username ;
            });
            this.setState({});
        });
    }

    renderResultsTable() {
        return (
            <Panel header={HEADINGS.TITLE} className="standard">
                <Table data={this.props.data} className="admin">
                    <Column dataKey="user_id" renderHeader={HEADINGS.USER}
                        renderCell={(userId) => {
                            return (
                                <Link to={`/user/${userId}`}>
                                    {this.userTableData[userId]}
                                </Link>
                            );
                        }}
                    />
                    <Column dataKey="data" renderHeader={HEADINGS.DATA}
                        renderCell={(data, row) => {
                            var tempRow = {
                                username: this.userTableData[row.user_id],
                                data: row.data
                            };
                            return (
                                <SurveyModal
                                    data={tempRow}
                                    loading={false}
                                    showModal={false}
                                />
                            );
                        }}></Column>
                </Table>
            </Panel>
        );
    }

    renderDataState() {
        if (this.props.loading) return null;

        if (this.userTableData !== {}) {
            return (this.renderResultsTable());
        }

        return (
            <h1>{HEADINGS.NODATA}</h1>
        );
    }

    render() {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                {this.renderDataState()}
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var links;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.items) {
        loading = state.page.loading;
        data = state.page.data._embedded.items;
        links = state.page.data._links.self.href;
    }

    return {
        data,
        loading,
        links
    };
};

Page = connect(mapStateToProps)(AAYView);
export default Page;

