import React from 'react';
import { connect } from 'react-redux';
import {Button, Input, Panel} from 'react-bootstrap';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';

import Layout from 'layouts/two_col';

import 'routes/users/profile.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-home';

var mapStateToProps;
var Page;

const BAD_GET = 'Unable to find user with the user id given';
export class GodModeHome extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: ''
        };
    }

    render() {
        if (this.props.data == null) {
            return null;
        }

        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
               <Panel header="Welcome to God Mode" className="standard">
                    <Input
                        type='text'
                        ref="userId"
                        value={this.state.userId}
                        placeholder="Enter the user id"
                        onChange={e => {
                            this.setState({userId: e.target.value});
                    }}/>
                    <br/>
                    <br/>
                    <Button href={`sa/user/${this.state.userId}/edit`}> Edit User </Button>
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


