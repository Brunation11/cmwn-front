import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

const nonMenuLinks = [
    'me',
    'self',
    'forgot',
    'user_image'
];

var Component = React.createClass({
    renderNavItems: function () {
        var menuItems = _.reduce(this.props.data, (a, i, k) => {
            if (!~nonMenuLinks.indexOf(k)) {
                a.push({
                    url: '/' + k,
                    text: i.label == null ? _.startCase(k) : i.label
                });
            }
            return a;
        }, []);
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
    data.groups = {label: 'My Classes'};
    data.organizations = {label: 'My Schools'};
    data.districts = {label: 'Districts'};
    data.users = {label: 'Users'};
    data.logout = {};
    return { currentUser: state.currentUser, data: Immutable(data) };
};

var SiteNav = connect(mapStateToProps)(Component);

export default SiteNav;

