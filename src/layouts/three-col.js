import React from 'react';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
    getDefaultProps: function () {
        return {
            rightPanel: this.props.rightPanel || (<div></div>)
        };
    },
    getInitialState: function () {
        EventManager.listen('menuIsOpen', val => {
            this.menuIsOpen = val;
            this.forceUpdate();
        });
        EventManager.update('menuIsOpen', false);
        return {};
    },
    render: function () {
        return (
             <div className="layout">
                <div className="content">
                    {this.props.children}
                </div>
                <Sidebar
                    currentUser={this.props.currentUser}
                    menuIsOpen={this.state.menuIsOpen}
                    navMenuId={this.props.navMenuId}
                />
                {this.props.rightPanel()}}
                <Footer loggedIn={this.props.currentUser && this.props.currentUser.username != null} />
             </div>
        );
    }
});

export default Layout;

