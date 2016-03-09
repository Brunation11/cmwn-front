import React from 'react';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

import Actions from 'components/actions';

/** Higher Order Component */
var GenerateDataSource = function (endpointIdentifier, componentName) {
    Actions.REGISTER_COMPONENT({endpointIdentifier, componentName});
    var Component = React.createClass({
        getInitialState: function () {
            return {};
        },
        getDefaultProps: function () {
            return {
                renderNoData: () => null,
                onError: _.noop
            };
        },
        componentDidMount: function () {
            Actions.START_COMPONENT_DATA(endpointIdentifier, componentName, this.props.onError);
        },
        componentWillReceiveProps: function (newProps) {
            this.setState({data: Immutable(this.props.transform(newProps.data.asMutable()))});
        },
        render: function () {
            var propsForChild;
            var props = _.reduce(this.props, (a, i, k) => {
                //we have to do this dumb copy because creating an immutable
                //out of dom nodes crashes overflows the call stack and
                //we cant delete the read only member children
                if (k !== 'children' && k !== 'transform') {
                    a[k] = i;
                }
                return a;
            }, {});

            if (this.props.data == null || (_.isArray(this.props.data) && this.props.data.length === 0)) {
                return (
                    <div className={this.props.className}>{this.props.renderNoData()}</div>
                );
            }

            props.data = this.state.data; //we only need this so the transformation will only be applied on new data
            propsForChild = Immutable(props)
                .set('componentName', componentName)
                .set('endpointIdentifier', endpointIdentifier);
            return (
                <div className={this.props.className}>
                    {React.Children.map(this.props.children, child => React.cloneElement(child, propsForChild))}
                </div>
            );
        }
    });
    const mapStateToProps = state => {
        var component;
        var data = {};
        var loading = true;
        if (state.components && state.components[endpointIdentifier + '-' + componentName]) {
            component = state.components[endpointIdentifier + '-' + componentName];
            loading = component.loading;
            data = component.data;
        }
        return {
            data,
            loading,
            component
        };
    };

    return connect(mapStateToProps)(Component);
};

export default GenerateDataSource;

