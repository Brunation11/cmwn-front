import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

//import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';


var SiteNav = React.createClass({
    renderNavItems: function () {
        return _.map(GLOBALS.TOP_NAV, item => (<li><Link to={item.URL}>{item.TEXT}</Link></li>));
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

