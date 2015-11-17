import React from 'react';

import Sidebar from 'components/sidebar';
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
                <div className="content">
                    {this.props.children}
                </div>
                <Sidebar menuIsOpen={this.menuIsOpen}/>
             </div>
        );
    }
});

export default Layout;

