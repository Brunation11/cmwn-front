import React from 'react';

import Sidebar from 'components/sidebar';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
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
                <Sidebar menuIsOpen={this.menuIsOpen}/>
             </div>
        );
    }
});

export default Layout;

