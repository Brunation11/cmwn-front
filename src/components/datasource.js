import React from 'react';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';

import Actions from 'components/actions';
import Store from 'components/store';
import Util from 'components/util';
import GLOBALS from 'components/globals';

var mapStateToProps;

/* Higher Order Component */
export default function (endpointIdentifier, componentName) {
    class Component extends React.Component {
        constructor() {
            super();
            this.state = {};
        }

        componentWillMount() {
            Actions.dispatch.REGISTER_COMPONENT(
                {endpointIdentifier: this.props.endpointIdentifier,
                componentName: this.props.componentName});
        }

        componentDidMount() {
            this.attemptLoadComponentData();
        }

        componentWillReceiveProps(newProps) {
            var mutableData;
            this.attemptLoadComponentData();

            if (!_.isEqual(newProps.data, this.props.data)) {
                mutableData = newProps.data.asMutable == null ? newProps.data : newProps.data.asMutable();
                this.setState({data: Immutable(this.props.transform(mutableData))});
            }
        }

        attemptLoadComponentData() {
            var state = Store.getState();
            if (this.props.noLink) return;
            Util.attemptComponentLoad(state, this.props.endpointIdentifier,
                componentName, this.props.onError);
        }

        reloadComponentData() {
            /** @TODO MPR, 3/24/16: Implement this action * */
            Actions.dispatch.RELOAD_COMPONENT({endpointIdentifier: this.props.endpointIdentifier,
                componentName: this.props.componentName});
        }

        render() {
            var propsForChild;
            var props = _.reduce(this.props, (a, i, k) => {
                // we have to do this dumb copy because creating an immutable
                // out of dom nodes overflows the call stack and
                // we cant just delete the read only member children
                if (k !== 'children' && k !== 'transform') {
                    a[k] = i;
                }
                return a;
            }, {});

            if (this.props.noLink) {
                return (
                    <div className={this.props.className}>{this.props.renderNoLink()}</div>
                );
            }

            if (this.props.data == null || (_.isArray(this.props.data) && this.props.data.length === 0)) {
                return (
                        <div className={this.props.className}>{this.props.renderNoData()}</div>
                );
            }

            props.data = this.state.data; // we only need this so the
            // transformation will only be
            // applied on new data
            propsForChild = Immutable(props)
                .set(
                    'rowCount',
                    this.props.component.page_size || this.props.rowCount || GLOBALS.DEFAULT_PAGINATION_ROWS
                )
                .set('currentPage', this.props.component.page || this.props.currentPage || 1)
                .set('pageCount', this.props.component.page_count || this.props.pageCount || 1)
                .set('componentName', this.props.componentName)
                .set('endpointIdentifier', this.props.endpointIdentifier);
            return (
                <div className={this.props.className}>
                    {React.Children.map(this.props.children,
                        child => React.cloneElement(child, propsForChild))}
                </div>
            );
        }
    }

    Component.defaultProps = {
        renderNoData: () => null,
        transform: _.identity,
        onError: _.noop
    };

    mapStateToProps = state => {
        var component = {};
        var data = {};
        var loading = true;
        var noLink = false;
        if (state.components && state.components[endpointIdentifier + '-' + componentName]) {
            component = state.components[endpointIdentifier + '-' + componentName];
            loading = component.loading;
            data = component.data;
        }
        if (state.currentUser && state.currentUser._links && !state.currentUser._links[endpointIdentifier]) {
            noLink = true;
        }
        return {
            endpointIdentifier,
            componentName,
            data,
            loading,
            component,
            noLink,
            lastLoadedStage: state.pageLoadingStage.lastCompletedStage
        };
    };

    return connect(mapStateToProps)(Component);
}
