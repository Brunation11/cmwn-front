import React from 'react';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

import Actions from 'components/actions';
import Store from 'components/store';
import Util from 'components/util';

/** Higher Order Component */
var GenerateDataSource = function (endpointIdentifier, componentName) {
    var Component = React.createClass({
        getInitialState: function () {
            Actions.dispatch.REGISTER_COMPONENT({endpointIdentifier, componentName});
            return {};
        },
        getDefaultProps: function () {
            return {
                renderNoData: () => null,
                transform: _.identity,
                onError: _.noop
            };
        },
        componentDidMount: function () {
            this.attemptLoadComponentData();
        },
        componentWillReceiveProps: function (newProps) {
            var mutableData = newProps.data.asMutable == null ? newProps.data : newProps.data.asMutable();
            this.attemptLoadComponentData();
            this.setState({data: Immutable(this.props.transform(mutableData))});
        },
        attemptLoadComponentData: function () {
            var state = Store.getState();
            Util.attemptComponentLoad(state, endpointIdentifier, componentName, this.props.onError);
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

