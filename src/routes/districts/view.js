import React from 'react';

import HttpManager from 'components/http_manager'
import GLOBALS from 'components/globals'


var View = React.createClass({
    render: function() {
        return (
            <div>View: {this.props.params.id}</div>
        );
    }
});

export default View;

