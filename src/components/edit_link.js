import React from 'react';
import {Link} from 'react-router';

const EDIT = 'edit';

var Page = React.createClass({
    render: function () {
        if (!this.props.canUpdate || this.props.uuid == null) {
            return null;
        }
        return (
            <p>
                <Link to={`${this.props.base}/${this.props.uuid}/edit`} >{EDIT}</Link>
            </p>
        );
    }
});

export default Page;

