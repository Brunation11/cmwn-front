import React from 'react';
import {Button} from 'react-bootstrap';

import Util from 'components/util';
import History from 'components/history';

const EDIT = 'Edit';

class EditLink extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.setupState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setupState(nextProps);
    }

    setupState(props) {
        var state = {};
        state.base = props.base;
        state.uuid = props.uuid || props.id;
        state.canUpdate = props.canUpdate !=
            null ? props.canUpdate : Util.decodePermissions(props.scope).update;
        this.setState(state);
    }

    render() {
        if ((!this.state.canUpdate && !this.state.scope) ||
            (this.state.uuid == null && this.state.id == null)) {
            return null;
        }
        return (
            <Button id="edit-btn" className={this.props.className + ' standard'}
                onClick={() => History.push(`${this.state.base}/${this.state.uuid}/edit`)}>
                {this.props.text ? this.props.text : EDIT}</Button>
        );
    }
}

EditLink.defaultProps = {
    base: '',
    className: 'green'
};

export default EditLink;

