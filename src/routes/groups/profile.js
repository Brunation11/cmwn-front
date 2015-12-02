import React from 'react';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import FlipBgDefault from 'media/flip-placeholder-white.png';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Util from 'components/util';

import 'routes/students/profile.scss';

const HEADINGS = {
    MY_CLASSMATES: 'My Classes'
};

var Page = React.createClass({
    myClassmates: [],
    group: null,
    componentWillMount: function () {
        this.getGroup();
        this.getMyClassmates();
    },
    getMyClassmates: function () {
        var fetchOrgs = HttpManager.GET({url: GLOBALS.API_URL + 'users/me?include=users'});
        fetchOrgs.then(res => {
            this.myClassmates = res.response.data.users.data;
            this.forceUpdate();
        }).catch(err => {
            console.info(err); //eslint-disable-line no-console
        });
    },
    getGroup: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}groups/${this.props.params.id}?include=users`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.group = res.response.data;
        });
    },
    renderFlip: function (item){
        return (
            <div className="flip"><a href={item.url}><img src={FlipBgDefault}></img></a></div>
        );
    },
    render: function () {
        if (this.group == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <Panel header={this.group.title} className="standard">
                   {this.group.description}
               </Panel>
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.MY_CLASSMATES} data={this.myClassmates} />
           </Layout>
        );
    }
});

export default Page;

