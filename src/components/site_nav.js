import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

const nonMenuLinks = [
    'me',
    'self',
    'profile',
    'games',
    'forgot',
    'user_image'
];

var addHardcodedEntries = function (menuItems) {
    menuItems.unshift({url: '/profile', text: 'Action Items'});
    menuItems.push({url: '/profile/edit', text: 'Edit My Profile'});
    return menuItems;
};

var Component = React.createClass({
    renderNavItems: function () {
        var menuItems = _.reduce(this.props.data, (a, i, k) => {
            if (!~nonMenuLinks.indexOf(k)) {
                var link = ~k.indexOf('_') ? k.split('_')[1] : k;
                a.push({
                    url: '/' + link,
                    text: i.label == null ? _.startCase(link) : i.label
                });
            }
            return a;
        }, []);
        menuItems = addHardcodedEntries(menuItems);
        return _.map(menuItems, item => (<li key={`(${item.text})-${item.url}`}><Link to={item.url}>{item.text}</Link></li>));
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

const mapStateToProps = state => {
    var data = [];
    state.currentUser;
    if (state.currentUser && state.currentUser._links) {
        data = state.currentUser._links.asMutable();
    }
    return { currentUser: state.currentUser, data: Immutable(data) };
};

var SiteNav = connect(mapStateToProps)(Component);

export default SiteNav;

