import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';


var SiteNav = React.createClass({
    menuItems: [],
    componentWillMount: function () {
        this.getMenuItems();
    },
    getMenuItems: function () {
            var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations'});
        urlData.then(res => {
            this.organizations = res.response.data;
            this.forceUpdate();
        });

    },
    renderNavItems: function () {
        return _.map(GLOBALS.TOP_NAV, item => (<li key={`(${item.TEXT}) ${item.URL}`}><Link to={item.URL}>{item.TEXT}</Link></li>));
    },
    render: function () {
        return (
            <nav className="">
                <ul>
                    {this.renderNavItems()}
                    <li><a href="#">Logout</a></li>
                </ul>
            </nav>
        );
    }
});

export default SiteNav;

