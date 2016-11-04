import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import ClassNames from 'classnames';
import PublicRoutes from 'public_routes';
import PrivateRoutes from 'private_routes';
import Util from 'components/util';

const WELCOME = 'Welcome';

var addHardcodedEntries = function (menuItems) {
    menuItems.push({url: '/sa/settings/users', label: 'Manage Users'});
    menuItems.push({url: '/sa/settings', label: 'God Mode Home'});
    menuItems.push({url: '/profile', label: 'Exit'});

    return menuItems;
};

var buildMenuRoutes = function (links) {
    var allRoutes = PublicRoutes.concat(PrivateRoutes);
    //goal here is to read all of our routes and match them against the list of available
    //links returned by the server. This way, we implicitly know which endpoint routes
    //have corresponding pages, and which are data only

    //reduce the set of links
    return _.reduce(links, (a, link, k) => {
        //try to match our endpoint to a route, and extract its parameters
        var url;
        var matchedRoute = _.reduce(allRoutes, (a, route) => { //eslint-disable-line no-shadow
            var params;
            var match;
            if (route.endpoint && link.label != null) {
                // there are three scenarios here - the endpoint is non dynamic, it is dynamic by parameter,
                // or it is dynamic based on the current user.

                //the current user style is easiest. just match on the key provided
                if (route.endpoint === '$$' + k ) {
                    //the problem with this is that we dont know the structure of the endpoint
                    //when we match on the current user style, so we have no way to extract parameters.
                    //This _probably_ wont be a problem...
                    match = route;
                    match.params = {};
                } else if (route.endpoint !== '/' && !~route.endpoint.indexOf(':') &&
                        ~link.href.indexOf(route.endpoint)
                    ) {
                    //nondynamic is also fairly easy, as urls cannot contain colonks
                    match = route;
                    match.params = {};
                } else {
                    //last chance. If we can extract parameters from the endpoint, its a match
                    params = Util.matchPathAndExtractParams(
                        route.endpoint, link.href.split('/').slice(3).join('/')
                    );
                    if (Object.keys(params).length) {
                        route.params = params;
                        match = route; //MPR: ok i admit the typechange is strange here
                                    //but i like it better than starting at null
                    }
                }
                if ((a && match && match.endpoint.length > a.endpoint.length) || (!a && match)) a = match;
            }
            return a;
        }, false);
        if (matchedRoute) {
            url = Util.replacePathPlaceholdersFromParamObject(matchedRoute.path,
                matchedRoute.params).split('(')[0];
            link = link.set('url', url.indexOf('/') === 0 ? url : '/' + url);
            a.push(link);
        }
        return a;
    }, []);
};

var GodModeSiteNav = React.createClass({
    renderNavItems: function () {
        var menuItems = buildMenuRoutes(this.props.data);
        var currentUrl;
        //manually hidden items for children
        menuItems = addHardcodedEntries.call(this, menuItems);

        if (sessionStorage == null) {
            return null;
        }

        _.map(menuItems, item => {
            currentUrl = window.location.href.replace(/^.*changemyworldnow.com/, '');
            if (sessionStorage.activeItem === item.label) {
                return;
            } else if (currentUrl === item.url) {
                sessionStorage.activeItem = item.label;
            }
        });

        return _.map(menuItems, item => (
            <li
                className={ClassNames({
                    'active-menu': sessionStorage.activeItem === item.label
                })}
                key={`(${item.label})-${item.url}`}
            >
                <Link
                    to={item.url}
                >
                    {item.label}
                </Link>
            </li>
        ));
    },

    renderWelcome: function () {
        return (
            <div>
                <p className={ClassNames('username')} style={{'fontSize': 25}}>
                    <Link to='/profile'>
                        {this.props.currentUser.username}
                    </Link>
                </p>
            </div>
        );
    },

    render: function () {
        debugger;
        return (
            <div className='sidebar'>
                {this.renderWelcome()}

                <nav className="">
                    <ul>
                        {this.renderNavItems()}
                    </ul>
                </nav>
            </div>
        );
    }
});

export default GodModeSiteNav;

