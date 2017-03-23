
import React from 'react';
import {Modal, Button, Input, Glyphicon} from 'react-bootstrap';
import ClassNames from 'classnames';
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
         button on top to make the cards.
    </span>),
    (<span>
        <span className="highlight">You're almost there! </span>Now you should see<br />
        the User Cards for your class.<br />
        At the top right of the page, click<span className="highlight"> print</span>
    </span>)
];

const LS_AUTOPLAY_KEY = 'TEACHER_GUIDE_DO_NOT_AUTO_OPEN';
const LS_CURRENT_PAGE = 'TEACHER_GUIDE_CURRENT_PAGE';
const LS_MINIMIZED = 'TEACHER_GUIDE_TAB_MINIMIZED';

/**
 * A tab for all adults. When clicked, provides a modal that walks them through basic
 * actions.
 */
class Guide extends React.Component {
    constructor() {
        super();
        var startClosed = false;
        var minimized = false;
        var page;
        //var modalOpen;

        try {
            startClosed = window.localStorage[LS_AUTOPLAY_KEY] === 'true';
            minimized = window.localStorage[LS_MINIMIZED] === 'true';
            page = +(window.localStorage[LS_CURRENT_PAGE]);
        } catch(error) {
            startClosed = window._localStorage[LS_AUTOPLAY_KEY] === 'true';
            minimized = window._localStorage[LS_MINIMIZED] === 'true';
            page = +(window._localStorage[LS_CURRENT_PAGE]);
        }

        if (isNaN(page)) page = 1;

        //if (!startClosed) {
            // if we autoplay once, dont do it again
        try {
            window.localStorage.setItem(LS_AUTOPLAY_KEY, startClosed);
        } catch(error) {
            window._localStorage.setItem(LS_AUTOPLAY_KEY, startClosed);
        }
        //    modalOpen = true;
        //    startClosed = true;
        //}

        this.state = {
            modalOpen: !startClosed,
            startClosed,
            minimized,
            page
        };
    }

    openModal() {
        this.setState({modalOpen: true});
    }

    closeModal() {
        this.setState({modalOpen: false});
    }

    nextPage() {
        try {
            window.localStorage.setItem(LS_CURRENT_PAGE, this.state.page + 1);
        } catch(error) {
            window._localStorage.setItem(LS_CURRENT_PAGE, this.state.page + 1);
        }
        this.setState({page: window.Math.min(4, this.state.page + 1)});

    }

    prevPage() {
        try {
            window.localStorage.setItem(LS_CURRENT_PAGE, this.state.page - 1);
        } catch(error) {
            window._localStorage.setItem(LS_CURRENT_PAGE, this.state.page - 1);
        }
        this.setState({page: window.Math.max(1, this.state.page - 1)});
    }

    toggleAutoplay() {
        try {
            window.localStorage.setItem(LS_AUTOPLAY_KEY, !this.state.startClosed);
        } catch(error) {
            window._localStorage.setItem(LS_AUTOPLAY_KEY, !this.state.startClosed);
        }
        this.setState({startClosed: !this.state.startClosed});
    }

    toggleTab() {
        try {
            window.localStorage.setItem(LS_MINIMIZED, !this.state.minimized);
        } catch(error) {
            window._localStorage.setItem(LS_MINIMIZED, !this.state.minimized);
        }
        this.setState({minimized: !this.state.minimized});
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
                    checked={this.state.startClosed}
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
            <div
                className={
                    ClassNames(
                        'animated bounceInUp ' + COMPONENT_IDENTIFIER,
                        {minimized: this.state.minimized}
                    )
                }
            >
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
                <span className={ClassNames({transhidden: this.state.minimized})}>
                    {CALL_TO_ACTION}
                    <Button className="standard purple" onClick={self.openModal.bind(self)}>
                        {BUTTON_TEXT}
                    </Button>
                </span>
                <a onClick={this.toggleTab.bind(this)}>
                    <Glyphicon glyph={ (this.state.minimized ? 'chevron-down' : 'chevron-up')} />
                </a>
            </div>
        );
    }
}

Guide.defaultProps = {isAdult: true};

export default Guide;
