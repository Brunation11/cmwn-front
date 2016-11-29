
import React from 'react';
import {Modal, Button} from 'react-bootstrap';
//import _ from 'lodash';
//import Shortid from 'shortid';
import ClassNames from 'classnames';

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

    nextPage() {
        this.setState({page: window.Math.min(4, this.state.page + 1)});
    }

    prevPage() {
        this.setState({page: window.Math.max(1, this.state.page - 1)});
    }

    renderPage(page){
        return (
            <div className="pages">
                {this.renderPage1(page === 1)}
                {this.renderPage2(page === 2)}
                {this.renderPage3(page === 3)}
                {this.renderPage4(page === 4)}
            </div>
        );
    }
    renderPage1(isActive) {
        return (
            <div>
                <span className={ClassNames('page-marker page-1', {isActive})}>page 1</span>
            </div>
        );
    }
    renderPage2(isActive) {
        return (
            <div>
                <span className={ClassNames('page-marker page-2', {isActive})}>page 2</span>
            </div>
        );
    }
    renderPage3(isActive) {
        return (
            <div>
                <span className={ClassNames('page-marker page-3', {isActive})}>page 3</span>
            </div>
        );
    }
    renderPage4(isActive) {
        return (
            <div>
                <span className={ClassNames('page-marker page-4', {isActive})}>page 4</span>
            </div>
        );
    }

    renderModal() {
        return (
            <div className="modal-guide">
                BORF
                <a id="close-modal" onClick={this.closeModal.bind(this)} className="modal-close">
                    <span className="close-x">X</span>
                </a>
                {this.renderPage(this.state.page)}
                <Button
                    onClick={this.prevPage.bind(this)}
                    className={'standard green', ClassNames({hidden: this.state.page === 1})}
                >
                    Back
                </Button>
                <Button
                    onClick={this.nextPage.bind(this)}
                    className={'standard purple', ClassNames({hidden: this.state.page === 4})}
                >
                    Next
                </Button>
                <Button
                    onClick={this.closeModal.bind(this)}
                    className={'standard green', ClassNames({hidden: this.state.page !== 4})}
                >
                    Done!
                </Button>
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
