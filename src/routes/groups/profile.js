import React from 'react';
import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Util from 'components/util';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/students/profile.scss';

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates'
};

var Page = React.createClass({
    componentWillMount: function () {
        this.getGroup();
    },
    getGroup: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}groups/${this.props.params.id}?include=users`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.group = res.response.data;
            this.forceUpdate();
        });
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid.toString()}`}><img src={item.image || DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                <p className="userFlips">0 Flips Earned</p>
            </div>
        );
    },
    renderClassInfo: function () {
        return (
           <Panel header={this.group.title} className="standard">
               {this.group.description}
           </Panel>
        );
    },
    render: function () {
        if (this.group == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.MY_CLASSMATES + ' - ' + this.group.title} data={this.group.users.data} />
           </Layout>
        );
    }
});

export default Page;

