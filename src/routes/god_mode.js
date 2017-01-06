import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import Layout from 'layouts/god_mode_two_col';

import 'routes/users/profile.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-home';

var mapStateToProps;
var Page;

const HEADINGS = {
    HEADER: 'Welcome To God Mode',
};

export class GodModeHome extends React.Component {
    constructor() {
        super();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
    }

    render() {
        if (this.props.data === null || _.isEmpty(this.props.data) ) {
            return null;
        }

        return (
           <Layout currentUser={this.props.currentUser} navMenuId="navMenu">
               <Panel header={HEADINGS.HEADER} className="standard">
                    <p>This is an admin dashboard</p>
               </Panel>
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser;
    if (state.page && state.page.data != null) {
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

Page = connect(mapStateToProps)(GodModeHome);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;


