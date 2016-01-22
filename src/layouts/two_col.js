import React from 'react';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

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
        return (
             <div className={'layout ' + this.props.className}>
                <div className="content">
                    {this.props.children}
                </div>
                <Sidebar menuIsOpen={this.state.menuIsOpen}/>
                <Footer />
             </div>
        );
    }
});

export default Layout;

