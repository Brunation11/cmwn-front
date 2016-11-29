
import React from 'react';
import {Modal, Button} from 'react-bootstrap';
//import _ from 'lodash';
//import Shortid from 'shortid';
//import ClassNames from 'classnames';

//import GLOBALS from 'components/globals';
//import ACTION_CONSTANTS from 'components/action_constants';

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
        this.state = {
            modalOpen: false,
            page: 1
        };
    }

    componentDidMount() {
    }

    openModal() {
        this.setState({modalOpen: true});
    }

    closeModal() {
        this.setState({modalOpen: false});
    }

    renderModal() {
        return (
            <div className="modal-guide">
                BORF
                <a id="close-modal" onClick={this.closeModal.bind(this)} className="modal-close">
                    <span className="close-x">X</span>
                </a>
            </div>
        );
    }

    render() {
        var self = this;
        if (!self.props.isAdult) {
            return null;
        }
        return (
        <div className={COMPONENT_IDENTIFIER}>{CALL_TO_ACTION}
            <Modal
                className="guide-modal"
                show={this.state.modalOpen}
                onHide={self.closeModal.bind(self)}
                keyboard={false}
                backdrop="static"
                id="guide-modal"
            >
                <Modal.Body>
                    {self.renderModal()}
                </Modal.Body>
            </Modal>
            <Button className="standard purple" onClick={self.openModal.bind(self)}>{BUTTON_TEXT}</Button>
        </div>
        );
    }
}

Guide.defaultProps = {isAdult: true};

export default Guide;
