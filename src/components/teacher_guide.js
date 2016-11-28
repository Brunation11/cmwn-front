
import React from 'react';
import {Panel, ButtonGroup, Button, DropdownButton, MenuItem} from 'react-bootstrap';
import _ from 'lodash';
import Shortid from 'shortid';
//import ClassNames from 'classnames';

import GLOBALS from 'components/globals';
import ACTION_CONSTANTS from 'components/action_constants';

import 'components/teacher_guide.scss';

export const COMPONENT_IDENTIFIER = 'teacher-guide';

const CALL_TO_ACTION = 'Need help navigating the page?';
const BUTTON_TEXT = 'Teacher\'s Guide';

/**
 * A tab for all adults. When clicked, provides a modal that walks them through basic
 * actions.
 */
class Guide extends React.Component {
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
        // state.canUpdate = props.canUpdate !=
        //     null ? props.canUpdate : Util.decodePermissions(props.scope).update;
        this.setState(state);
    }

    render() {
        if (!this.props.isAdult) {
            return null;
        }
        return (
        <div className={COMPONENT_IDENTIFIER}>{CALL_TO_ACTION}<Button className="standard purple">{BUTTON_TEXT}</Button></div>
        );
    }
};

Guide.defaultProps = {isAdult: true};

export default Guide;
