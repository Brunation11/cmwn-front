import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

import PublicRoutes from 'public_routes';
import PrivateRoutes from 'private_routes';
import Util from 'components/util';

var addHardcodedEntries = function (menuItems) {
    menuItems.unshift({url: '/profile', label: 'Action Items'});
    menuItems.push({url: '/profile/edit', label: 'Edit My Profile'});
    menuItems.push({url: '/logout', label: 'Logout'});
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
            if (!a && route.endpoint && link.label != null) {
                // there are three scenarios here - the endpoint is non dynamic, it is dynamic by parameter,
                // or it is dynamic based on the current user.

                //the current user style is easiest. just match on the key provided
                if (route.endpoint === '$$' + k ) {
                    //the problem with this is that we dont know the structure of the endpoint
                    //when we match on the current user style, so we have no way to extract parameters.
                    //This _probably_ wont be a problem...
                    a = route;
                    a.params = {};
                } else if (route.endpoint !== '/' && !~route.endpoint.indexOf(':') &&
                           ~link.href.indexOf(route.endpoint)) {
                    //nondynamic is also fairly easy, as urls cannot contain colonks
                    a = route;
                    a.params = {};
                } else {
                    //last chance. If we can extract parameters from the endpoint, its a match
                    params = Util.matchPathAndExtractParams(route.endpoint, link.href);
                    if (Object.keys(params).length) {
                        route.params = params;
                        a = route; //MPR: ok i admit the typechange is strange here
                                    //but i like it better than starting at null
                    }
                }
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

var Component = React.createClass({
    renderNavItems: function () {
        var menuItems = buildMenuRoutes(this.props.data);
//        var menuItems = _.reduce(this.props.data, (a, i, k) => {
//            if (i.label != null) {
//                var link = ~k.indexOf('_') ? k.split('_')[1] : k;
//                a.push({
//                    url: i.view_url || '/' + link,
//                    text: i.label == null ? _.startCase(link) : i.label
//                });
//            }
//            return a;
//        }, []);
        menuItems = addHardcodedEntries(menuItems);
        return _.map(menuItems, item =>
            (<li key={`(${item.label})-${item.url}`}><Link to={item.url}>{item.label}</Link></li>));
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

var mapStateToProps = state => {
    var data = [];
    state.currentUser;
    if (state.currentUser && state.currentUser._links) {
        data = state.currentUser._links.asMutable();
    }
    return { currentUser: state.currentUser, data: Immutable(data) };
};

var SiteNav = connect(mapStateToProps)(Component);

export default SiteNav;

