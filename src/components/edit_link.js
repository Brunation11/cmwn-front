import React from 'react';
import {Link} from 'react-router';

import Util from 'components/util';

const EDIT = 'Edit';

var Page = React.createClass({
    getDefaultProps: function () {
        return {base: ''};
    },
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        this.setupState(this.props);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setupState(nextProps);
    },
    setupState: function (props) {
        var state = {};
        state.base = props.base;
        state.uuid = props.uuid || props.id;
        state.canUpdate = props.canUpdate != null ? props.canUpdate : Util.decodePermissions(props.scope).update;
        this.setState(state);
    },
    render: function () {
        if ((!this.state.canUpdate && !this.state.scope) || (this.state.uuid == null && this.state.id == null)) {
            return null;
        }
        return (
            <p>
                <Link to={`${this.state.base}/${this.state.uuid}/edit`} >{EDIT}</Link>
            </p>
        );
    }
});

export default Page;

