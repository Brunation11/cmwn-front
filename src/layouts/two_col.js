import React from 'react';
import { connect } from 'react-redux';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

var Page;
var mapStateToProps;

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
             <div className={'layout ' + this.props.className}>
                <Sidebar
                    currentUser={this.props.currentUser}
                    menuIsOpen={this.state.menuIsOpen}
                    navMenuId={this.props.navMenuId}
                />
                <div className="content">
                    {this.props.children}
                </div>
                <Footer loggedIn={this.props.currentUser && this.props.currentUser.username != null} />
             </div>
        );
    }
});

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = state.currentUser;
    if (state.page && state.page.loading && state.page.data) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading,
        currentUser,
    };
};

var Page = connect(mapStateToProps)(Layout);
export default Page;

