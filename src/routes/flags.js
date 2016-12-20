import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';

export const PAGE_UNIQUE_IDENTIFIER = 'flag-view';
var mapStateToProps;
var Page;

const HEADINGS = {
    TITLE: 'Flagged Images',
    FLAGGER: 'Flagging Person',
    FLAGGEE: 'Person Flagged',
    REASON: 'Reason',
    IMAGE: 'Image'
};

const TEXT = {
    NO_FLAGS: 'Sorry. There are no flagged images to display at this time.'
};


export class FlagView extends React.Component {

    renderFlagTable() {
        var data = this.props.data._embedded.flags;
        return (
            <Panel header={HEADINGS.TITLE} className="standard">
                <Table data={data} className="admin">
                    <Column dataKey="flagger" renderHeader={HEADINGS.FLAGGER}
                        renderCell={(flagger, row) => {
                            return (
                                <Link to={`/user/${row.flagger.user_id}`}>
                                        {row.flagger.first_name + ' ' + row.flagger.last_name}
                                </Link>
                            );
                        }}/>
                    <Column dataKey="flaggee" renderHeader={HEADINGS.FLAGGEE}
                        renderCell={(flaggee, row) => {
                            return (
                                <Link to={`/user/${row.flaggee.user_id}`}>
                                        {row.flaggee.first_name + ' ' + row.flaggee.last_name}
                                </Link>
                            );
                        }}/>
                    <Column dataKey="url" renderHeader={HEADINGS.IMAGE}
                        renderCell={(url) => {
                            return (
                                <a href={url}><img src={url} width="100"/></a>
                            );
                        }}/>
                    <Column dataKey="reason" renderHeader={HEADINGS.REASON}/>
                </Table>
            </Panel>
        );
    }

    renderDataState() {
        if (this.props.loading) return null;

        if (!this.props.data._embedded.flags.length) {
            return (
                    <h2 className="placeholder">{TEXT.NO_FLAGS}</h2>
            );
        }

        return (this.renderFlagTable());
    }

    render() {
        return (
            <Layout
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
                currentUser={this.props.currentUser}
            >
                    {this.renderDataState()}
            </Layout>
        );
    }
}


mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.flags) {
        loading = state.page.loading;
        data = state.page.data;
    }

    if (state.currentUser != null){
        currentUser = state.currentUser;
    }

    return {
        data,
        currentUser,
        loading
    };
};

Page = connect(mapStateToProps)(FlagView);
export default Page;
