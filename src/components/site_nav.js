import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Shortid from 'shortid';

import ClassNames from 'classnames';
import PublicRoutes from 'public_routes';
import PrivateRoutes from 'private_routes';
import Util from 'components/util';
import LINKS from 'components/ib_links';

import SKRIBBLE_LINK from 'media/skribble-link.png';

var helpLink = function () {
    var help = {url: '/help', label: 'Help'};
    if (this.props.currentUser.type === 'CHILD') {
        help.url = LINKS.FAQS.STUDENT;
    }
    return help;
};

var addHardcodedEntries = function (menuItems) {
    menuItems.unshift({
        url: '/play/skribble',
        uuid: 'Skribble',
        label: <img src={SKRIBBLE_LINK} alt="Skribble" />
    });
    menuItems.unshift({url: '/profile', label: 'Activities'});
    menuItems.push({url: '/resources', label: 'Resource Center'});
    menuItems.push({url: '/profile/edit', label: 'Edit My Profile'});
    menuItems.push(helpLink.call(this));
    menuItems.push({url: '/logout', label: 'Logout'});
    return menuItems;
};

const IGNORED_ROUTES_FOR_CHILDREN = [
    'Friends and Network',
    'Resource Center',
    'Flags'
];

const IGNORED_ROUTES_FOR_EVERYONE = [
    'Profile',
    'Games',
    'My Earned Flips'
];

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

var SiteNav = React.createClass({
    renderNavItems: function () {
        var currentUrl;
        var menuItems = buildMenuRoutes(this.props.data);
        //manually hidden items for children
        menuItems = addHardcodedEntries.call(this, menuItems);

        menuItems = _.filter(menuItems, item =>
            !~IGNORED_ROUTES_FOR_EVERYONE.indexOf(item.label) && (
                this.props.currentUser.type !== 'CHILD' || (
                    this.props.currentUser.type === 'CHILD' &&
                    !~IGNORED_ROUTES_FOR_CHILDREN.indexOf(item.label))
            )
        );

        currentUrl = window.location.href.replace(/^.*changemyworldnow.com/, '');

        try {
            _.map(menuItems, item => {
                if (window.sessionStorage.activeItem + '' !== 'undefined' && (
                        window.sessionStorage.activeItem === item.label ||
                        window.sessionStorage.activeItem === item.uuid
                )) {
                    return;
                } else if (currentUrl === item.url) {
                    window.sessionStorage.activeItem = item.label;
                }
            });
        } catch(error) {
            _.map(menuItems, item => {
                if (window._sessionStorage.activeItem + '' !== 'undefined' && (
                        window._sessionStorage.activeItem === item.label ||
                        window._sessionStorage.activeItem === item.uuid
                )) {
                    return;
                } else if (currentUrl === item.url) {
                    window._sessionStorage.activeItem = item.label;
                }
            });
        }

        return _.map(menuItems, item => {
            var link = (
                <Link
                    to={item.url}
                >
                    {item.label}
                </Link>
            );

            if (item.url.includes('http')) { // direct link to open in new tab/window
                link = (
                    <a
                        href={item.url}
                        target="_blank"
                    >
                        {item.label}
                    </a>
                );
            }
            return (
                <li
                    className={ClassNames({
                        'active-menu':
                            sessionStorage.activeItem + '' !== 'undefined' && (
                            sessionStorage.activeItem === item.label ||
                            sessionStorage.activeItem === item.uuid)
                    })}
                    key={Shortid.generate()}
                >
                    {link}
                </li>
            );
        });
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

