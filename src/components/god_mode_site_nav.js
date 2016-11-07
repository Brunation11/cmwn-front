import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import ClassNames from 'classnames';
import PrivateRoutes from 'private_routes';
import Util from 'components/util';

class GodModeSiteNav extends React.Component {
    constructor(props) {
        debugger;
        super(props);
    }

    componentDidMount() {
        this.getSaSettingsLinks();
    }

    addHardcodedEntries(menuItems) {
        menuItems.unshift({url: '/sa/settings', label: 'God Mode Home'});
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
        var saLinks = _.values(this.state.saLinks);
        var saRoutes = _.filter(PrivateRoutes, (route) => {
                return (route.path)
        });
        var menuItems = _.filter(saLinks, (item) => {
            _.map(PrivateRoutes, (route) => {
                var params = {};
                var url;
                if ( route.path.match(/^sa/g) &&
                     route.endpoint === '/' + item.href.split('/').slice(3).join('/')) {

                    if (route.endpoint.indexOf(':')) {
                        params = Util.matchPathAndExtractParams(
                            route.endpoint, item.href.split('/').slice(3).join('/')
                        );
                    }
                    url = Util.replacePathPlaceholdersFromParamObject(route.path,
                        params).split('(')[0];
                    item['url'] = url.indexOf('/') === 0 ? url : '/' + url;
                }
            });

            if (!_.has(item, 'url')) return false;
            return true;
        });
        console.log(menuItems);
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
                <p className={ClassNames('username')} style={{'fontSize': 25}}>
                    <Link to="/profile">
                        {this.props.currentUser.username}
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        if (!this.props.currentUser || !this.props.currentUser._links ) return null;

        return (
            <div className="sidebar">
                {this.renderWelcome()}

                <nav className="">
                    <ul>
                        {this.renderNavItems()}
                    </ul>
                </nav>
            </div>
        );
    }
}

export default GodModeSiteNav;

