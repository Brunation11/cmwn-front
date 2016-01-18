import React from 'react';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
    componentWillMount: function () {
        EventManager.listen('menuIsOpen', val => {
            this.menuIsOpen = val;
            this.forceUpdate();
        });
        EventManager.update('menuIsOpen', false);
    },
    render: function () {
        return (
             <div className={'layout ' + this.props.className}>
                <Sidebar menuIsOpen={this.menuIsOpen}/>
                <div className="content">
                    {this.props.children}
                </div>
                <Footer />
             </div>
        );
    }
});

export default Layout;

