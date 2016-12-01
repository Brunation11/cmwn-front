
import React from 'react';
import {Modal, Button, Input} from 'react-bootstrap';
//import _ from 'lodash';
//import Shortid from 'shortid';
import ClassNames from 'classnames';

//import GLOBALS from 'components/globals';
//import ACTION_CONSTANTS from 'components/action_constants';

import 'components/teacher_guide.scss';

export const COMPONENT_IDENTIFIER = 'teacher-guide';

const CALL_TO_ACTION = 'Need help navigating the page?';
const BUTTON_TEXT = 'Teacher\'s Guide';

const IMGAGES = [
    '', //MPR, 9/30/16: I'm lazy and want the indexes to match the pages
    'https://media-staging.changemyworldnow.com/f/3701d7ac521b378f6ed27e5651759402.png',
    'https://media-staging.changemyworldnow.com/f/f3bb52b2a0fdc0b05fdb89dbbfc59524.png',
    'https://media-staging.changemyworldnow.com/f/8b040b0a0be449376b74fa48b9717e7e.png',
    'https://media-staging.changemyworldnow.com/f/b8612cb4695a3702fda87c3a2e846db9.png'
];

const COPY = [
    '', //MPR, 9/30/16: I'm lazy and want the indexes to match the pages
    (<span>
         <span className="highlight">Welcome to our teacher's guide</span>
         to printing out student user cards.<br />Your first step is to click
         "My Classes" on the left side menu.
    </span>),
    (<span>
         You will then find a link in the My Classes page<br />with your class name on it.
        <span className="highlight"> Click on the link.</span>
    </span>),
    (<span>
         Click the<br /><span className="highlight">"generate user cards"</span>
         button on top to make the cards.</span>),
    (<span>
        <span className="highlight">You're almost there! </span>Now you should see<br />
        the User Cards for your class.<br />
        At the top right of the page, click<span className="highlight"> print</span>
    </span>)
];

/**
 * A tab for all adults. When clicked, provides a modal that walks them through basic
 * actions.
 */
class Guide extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen: false,
            autoPlay: true,
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

    toggleAutoplay() {
        this.setState({autoPlay: !this.state.autoPlay});
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
                <div className={ClassNames('page-marker page-1', {isActive})}>
                    <h2>step <span className="page-num">1</span></h2>
                    <section className="feature">
                        <img src={IMGAGES[1]} width="541" height="316" />
                    </section>
                    <p>{COPY[1]}</p>
                </div>
            </div>
        );
    }
    renderPage2(isActive) {
        return (
            <div>
                <div className={ClassNames('page-marker page-2', {isActive})}>
                    <h2>step <span className="page-num">2</span></h2>
                    <section className="feature">
                        <img src={IMGAGES[2]} width="541" height="373" />
                    </section>
                    <p>{COPY[2]}</p>
                </div>
            </div>
        );
    }
    renderPage3(isActive) {
        return (
            <div>
                <div className={ClassNames('page-marker page-3', {isActive})}>
                    <section className="feature">
                        <img src={IMGAGES[3]} width="541" height="349" />
                    </section>
                    <h2>step 3</h2>
                    <p>{COPY[3]}</p>
                </div>
            </div>
        );
    }
    renderPage4(isActive) {
        return (
            <div>
                <div className={ClassNames('page-marker page-4', {isActive})}>
                    <section className="feature">
                        <img src={IMGAGES[4]} width="541" height="352" />
                    </section>
                    <h2>step 4</h2>
                    <p>{COPY[4]}</p>
                </div>
            </div>
        );
    }

    renderModal() {
        return (
            <div className="modal-guide">
                <a id="close-modal" onClick={this.closeModal.bind(this)} className="modal-close">
                    <span className="close-x">X</span>
                </a>
                {this.renderPage(this.state.page)}
                <Input
                    type="radio"
                    ref="show-pass"
                    name="toggle"
                    className="toggle-characters"
                    label="Don't show me this again"
                    value="text"
                    checked={this.state.autoPlay}
                    onChange={this.toggleAutoplay.bind(this)}
                />
                <div className="button-container" >
                    <Button
                        onClick={this.prevPage.bind(this)}
                        className={ClassNames('standard green', {hidden: this.state.page === 1})}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={this.nextPage.bind(this)}
                        className={ClassNames('standard', {
                            hidden: this.state.page === 4,
                            green: this.state.page === 1,
                            purple: this.state.page !== 1
                        })}
                    >
                        Next
                    </Button>
                    <Button
                        onClick={this.closeModal.bind(this)}
                        className={ClassNames('standard green', {hidden: this.state.page !== 4})}
                    >
                        Done!
                    </Button>
                </div>
                <div className="page-count">{this.state.page} out of 4</div>
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
