import React from 'react';

import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import EventManager from 'components/event_manager';

var Layout = React.createClass({
    getInitialProps: function () {
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
                <Sidebar menuIsOpen={this.menuIsOpen}/>
                {this.props.rightPanel()}}
                <Footer />
             </div>
        );
    }
});

export default Layout;

