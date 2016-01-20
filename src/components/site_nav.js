import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';


var SiteNav = React.createClass({
    componentWillMount: function () {
        this.menuItems = [];
        this.getMenuItems();
    },
    getMenuItems: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'sidebar'});
        urlData.then(res => {
            this.menuItems = _.map(_.pairs(res.response.data[0]), (value) => ({text: value[0], url: value[1]}));
            this.forceUpdate();
        }).catch(err => {
            Log.warn(err, 'could not load menu'); //eslint-disable-line no-console
        });

    },
    renderNavItems: function () {
        return _.map(this.menuItems, item => (<li key={`(${item.text}) ${item.url}`}><Link to={item.url}>{item.text}</Link></li>));
    },
    render: function () {
        return (
            <nav className="">
                <ul>
                    {this.renderNavItems()}
                </ul>
            </nav>
        );
    }
});

export default SiteNav;

