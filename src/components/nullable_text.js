/** @TODO MPR, 3/23/16: MARKED FOR DEPRECATON **/
import React from 'react';
import _ from 'lodash';

//I am not sure that I love this syntax. It separates the nesting of the inner
//text too much from the predicatable layout of html. The conditional_paragraph
//component will attempt to alleviate this issue.
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


