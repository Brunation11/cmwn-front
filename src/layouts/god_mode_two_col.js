import React from 'react';
import ClassNames from 'classnames';

import GodModeSiteNav from 'components/god_mode_site_nav';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
    getDefaultProps: function () {
        return {navMenuId: ''};
    },
    getInitialState: function () {
        return {menuIsOpen: false};
    },
    componentDidMount: function () {
        EventManager.listen('menuIsOpen', val => {
            this.setState({menuIsOpen: val});
        });
    },
    render: function () {
        return (
             <div className={'layout'}>
                <GodModeSiteNav
                    currentUser={this.props.currentUser}
                    navMenuId={this.props.navMenuId}
                    data={this.props.data}
                />
                <div className={ClassNames('content', this.props.className)}>
                    {this.props.children}
                </div>
                <Footer loggedIn={this.props.currentUser && this.props.currentUser.username != null} />
             </div>
        );
    }
});

export default Layout;

