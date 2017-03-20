import React from 'react';
import {Button, Modal, Row, Col} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import History from 'components/history';
import 'components/timer_modal.scss';

import TEXT_UHOH from 'media/timer/text-uhoh.png';

const TIMEOUT_WAIT = 600000;
const TIMEOUT_WARNING = 60000;


class TimerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: this.getTimeRemaining(),
            showModal: false,
        };
        this.logout = this.logout.bind(this);
        this.checkTime = this.checkTime.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    getTimeRemaining() {
        var endTime = Date.parse(HttpManager.lastTime) + TIMEOUT_WAIT;
        return endTime - Date.parse(new Date());
    }

    checkTime() {
        var time = this.getTimeRemaining();
        if (time <= 0 && this.props.currentUser.user_id) {
            this.logout();
        } else if (time <= TIMEOUT_WARNING && this.props.currentUser.user_id) {
            this.setState({timeRemaining: time, showModal: true});
        }
    }

    componentDidMount() {
        this.timeUpdate = window.setInterval(this.checkTime, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timeUpdate);
    }

    logout() {
        History.push('/logout');
        this.setState({showModal: false});
    }

    resetTimer() {
        this.setState({showModal: false});
        HttpManager.GET({
            url: (GLOBALS.API_URL),
            handleErrors: false
        });
    }

    timeToString(time) {
        var curSeconds = time / 1000;
        var toPrepend = curSeconds < 10 ? '0' : '';
        return toPrepend + curSeconds;
    }

    render() {
        if (!this.props.currentUser.user_id) {
            return null;
        }
        return (
            <Modal
                id="timer-modal"
                className="timer-modal"
                show={this.props.currentUser.user_id && this.state.showModal}
                onHide={this.resetTimer}>

                <Modal.Body>
                    <img className="text-uhoh" src={TEXT_UHOH}></img>
                    <span className="text-inactive">
                        {/* wrap parts of text in inline-block to ensure words stay on same line */}
                        You've been <span className="underline inactive">inactive</span> and will be{' '}
                        <span className="inline-block">logged out</span> <span className="inline-block">
                        in <span className="underline seconds">60 seconds </span></span>
                    </span>
                    <Row>
                        <Col xs={12} sm={6}>
                            <div className="timer-container">
                                TIMER
                                <div className="timer">
                                    00:
                                    {this.timeToString(this.state.timeRemaining)}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Button onClick={this.resetTimer}>
                                KEEP ME LOGGED IN... I WANT TO KEEP{' '}
                                    <span className="inline-block">CHANGING THE WORLD!</span>
                            </Button>
                            <Button onClick={this.logout}>
                                I'M DONE FOR NOW, BUT <span className="inline-block">I'LL BE BACK!</span>
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default TimerModal;
