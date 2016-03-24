import React from 'react';
import _ from 'lodash';

var Page = React.createClass({
    getDefaultProps: function () {
        return {label: ''};
    },
    render: function () {
        var text;
        if ((this.props.text == null && this.props.data == null) || !_.isObject(this.props.children)) {
            return null;
        }
        text = this.props.data || this.props.text;
        return (
            React.cloneElement(this.props.children, this.props.children.props, this.props.label + text)
        );
    }
});

export default Page;


