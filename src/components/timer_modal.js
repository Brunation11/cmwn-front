import React from 'react';
import {Button, Modal, Row, Col} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import History from 'components/history';
import 'components/timer_modal.scss';

import TEXT_UHOH from 'media/timer/text-uhoh.png';

const TIMEOUT_WAIT = 25000;
const TIMEOUT_WARNING = 15000;


class TimerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: this.getTimeRemaining(),
            showModal: true
        };
    }

    getTimeRemaining() {
        var endTime = Date.parse(HttpManager.lastTime) + TIMEOUT_WAIT;
        return endTime - Date.parse(new Date());
    }

    componentDidMount() {
        var self = this;
        this.timeUpdate = window.setInterval(function () {
            var time = self.getTimeRemaining();
            if (time <= 0 && self.props.currentUser.user_id) {
                //self.logout();
            } else {
                self.setState({timeRemaining: time});
            }
        }, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timeUpdate);
        window.clearTimeout(this.resetConfirm);
    }

    logout() {
        History.push('/logout');
        self.setState({showModal: false});
    }

    resetTimer() {
        var self = this;
        this.setState({showModal: false});
        HttpManager.GET({
            url: (GLOBALS.API_URL),
            handleErrors: false
        }).then(() => {
            // delay to make sure time resets before showing modal
            this.resetConfirm = window.setTimeout(() => {
                self.setState({showModal: true});
            }, 3000);
        });
    }

    timeToString(time) {
        var curSeconds = time / 1000;
        var toPrepend = curSeconds < 10 ? '0' : '';
        return toPrepend + curSeconds;
    }

    render() {
        return (
            <Modal
                id="timer-modal"
                className="timer-modal"
                show={this.props.currentUser.user_id && this.state.showModal &&
                    this.state.timeRemaining < TIMEOUT_WARNING}
                onHide={this.resetTimer.bind(this)}>

                <Modal.Body>
                    <img className="text-uhoh" src={TEXT_UHOH}></img>
                    <span className="text-inactive">
                        You've been
                        <span className="underline inactive"> inactive </span>
                        and will be logged out in{' '}
                        <span className="underline seconds">60 seconds </span>
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
                            <Button onClick={this.resetTimer.bind(this)}>
                                KEEP ME LOGGED IN... I WANT TO KEEP CHANGING THE WORLD!
                            </Button>
                            <Button onClick={this.logout.bind(this)}>
                                I'M DONE FOR NOW, BUT I'LL BE BACK!
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default TimerModal;
