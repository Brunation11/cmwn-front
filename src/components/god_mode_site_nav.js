import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import ClassNames from 'classnames';
import PrivateRoutes from 'private_routes';
import Util from 'components/util';

import 'components/god_mode_site_nav.scss';

class GodModeSiteNav extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSaSettingsLinks();
    }

    addHardcodedEntries(menuItems) {
        menuItems.unshift({url: '/sa', label: 'God Mode Home'});
        menuItems.push({url: '/profile', label: 'Exit'});

        return menuItems;
    }

    getSaSettingsLinks() {
        var links = this.props.currentUser._links;
        if (!links || !links.sa_settings) return;
        var promise = Promise.all([HttpManager.GET(links.sa_settings.href)]);
        var saLinks;
        promise.then((res) => {
            this.setState({saLinks: res[0].response._links});
        });
    }

    buildMenuRoutes() {
        if (!this.state || !this.state.saLinks) return [];

        var saLinks = _.clone(this.state.saLinks, true);

        var menuItems = _.filter(saLinks, (item, key) => {
            _.map(PrivateRoutes, (route) => {
                var params = {};
                var url;
                if (route.path.match(/^sa/g) && route.endpoint && item.label !== null) {

                    if (~route.endpoint.indexOf(':')) {
                    // if there are params in the route end point, we try to extract params
                    // and if no params could be extracted, route is ignored
                        params = Util.matchPathAndExtractParams(
                            route.endpoint, item.href.split('/').slice(3).join('/')
                        );

                        if (! _.keys(params).length) return;
                    }

                    if (!~route.endpoint.indexOf('$$') && !~item.href.indexOf(route.endpoint)) return;

                    url = Util.replacePathPlaceholdersFromParamObject(route.path, params).split('(')[0];
                    item['url'] = url.indexOf('/') === 0 ? url : '/' + url;
                }
            });

            if (!_.has(item, 'url')) return false;

            return true;
        });

        return menuItems;
    }

    renderNavItems() {
        var menuItems = this.buildMenuRoutes();
        menuItems = this.addHardcodedEntries(menuItems);

        var currentUrl;

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
    }

    renderWelcome() {
        return (
            <div>
                <p className={ClassNames('username')} style={{'fontSize': 40}}>
                    <Link to="/sa">
                        Admin
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        if (!this.props.currentUser || !this.props.currentUser._links ) return null;

        return (
            <div id="god-mode-site-nav">
                <div className="sidebar">
                    {this.renderWelcome()}

                    <nav className="">
                        <ul>
                            {this.renderNavItems()}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default GodModeSiteNav;

