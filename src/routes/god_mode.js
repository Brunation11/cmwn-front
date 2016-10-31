import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';

import 'routes/users/profile.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-home';

var mapStateToProps;
var Page;

export class SchoolProfile extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
               <Panel header="Welcome to God Mode" className="standard">
                    <input onClick={this.goToUser} value={"user id"} />
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

Page = connect(mapStateToProps)(SchoolProfile);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;


