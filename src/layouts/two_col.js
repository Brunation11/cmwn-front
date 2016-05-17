import React from 'react';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';
import Store from 'components/store';

var Layout = React.createClass({
    getInitialState: function () {
        return {menuIsOpen: false};
    },
    componentDidMount: function () {
        EventManager.listen('menuIsOpen', val => {
            this.setState({menuIsOpen: val});
        });
    },
    render: function () {
        var state = Store.getState();
        return (
             <div className={'layout ' + this.props.className}>
                <Sidebar menuIsOpen={this.state.menuIsOpen}/>
                <div className="content">
                    {this.props.children}
                </div>
                <Footer loggedIn={state && state.currentUser && state.currentUser.username != null} />
             </div>
        );
    }
});

export default Layout;

