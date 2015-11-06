import React from 'react';

var Toggler = React.createClass({
    getDefaultProps: function () {
        return {isOpen: false};
    },
    render: function () {
        return (
           <span className="toggler" > {(this.props.isOpen ? '-' : '+')}</span>
        );
    }
});

export default Toggler;

