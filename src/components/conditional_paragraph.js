import React from 'react';
import _ from 'lodash';

var Component = React.createClass({
    render: function () {
        debugger;
        if (this.props.children == null) {
            return null;
        }
        return (
            <div>
                {React.Children.map(this.props.children, child => {
                    var childProps = {};
                    if (child.props.children != null && child.props.children !== '') {
                        childProps = _.reduce(child.props, (a, i, k) => {
                            if (k !== 'children') {
                                a[k] = i;
                            }
                            return a;
                        }, {});
                        if (_.isString(child.props.children) || _.isObject(child.props.children)) {
                            return React.cloneElement(child, childProps, [child.props.pre, child.props.children, child.props.post]);
                        } else if (_.isArray(child.props.children)) {
                            return React.cloneElement(child, childProps, [child.props.pre, ...child.props.children, child.props.post]);
                        }
                    }
                    return null;
                })}
            </div>
        );
    }
});

export default Component;



