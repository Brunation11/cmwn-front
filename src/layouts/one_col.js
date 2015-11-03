import React from 'react';

import Sidebar from 'components/sidebar';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
    getInitialState: function () {
        var self = this;
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
             </div>
        );
    }
});

export default Layout;

