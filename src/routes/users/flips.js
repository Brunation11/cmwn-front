import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import Flipcase from 'components/flipcase';
import GenerateDataSource from 'components/datasource';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'flips';

const FLIP_SOURCE = GenerateDataSource('user_flip', PAGE_UNIQUE_IDENTIFIER);

const HEADER = 'FLIP CASE';

export class FlipWall extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (!this.props.data || !this.props.data._embedded) return null;
        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                <Panel className="standard" header={HEADER}>
                    <FLIP_SOURCE>
                        <Flipcase
                            header={true}
                            render="all"
                            allFlips={this.props.data._embedded.flip || this.props.data._embedded.flip_user}
                        />
                    </FLIP_SOURCE>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(FlipWall);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
