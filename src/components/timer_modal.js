import React from 'react';

/* eslint-disable */
import {Button, Modal} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import History from 'components/history';

const TIMEOUT_WAIT = 15000;
const TIMEOUT_WARNING = 6000;

var timerInfo;

class TimerInfo {
    constructor () {
        this.lastTime = new Date();
    }

    setLastTime (date) {
        this.lastTime = date;
    }
}

class TimerModal extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            timeRemaining: this.getTimeRemaining()
        }
    }

    getTimeRemaining () {
        var endTime = Date.parse(this.props.timerInfo.lastTime) + TIMEOUT_WAIT;
        return endTime - Date.parse(new Date());
    }

    componentDidMount () {
        var self = this;
        this.timeUpdate = window.setInterval(function () {
            var time = self.getTimeRemaining();
            if (time <= 0 && self.props.currentUser.user_id) {
                //console.log("logout");
                window.clearInterval(this.timeUpdate);
                window.clearTimeout(this.resetConfirm);
                History.push('/logout');
            } else {
                self.setState({timeRemaining: time});
            }
        }, 1000);
    }

    resetTimer () {
        this.setState({resetting: true});
        var self = this;
        HttpManager.GET({
            url: (GLOBALS.API_URL),
            handleErrors: false
        }).then(() => {
            // delay to give the modal time to close
            this.resetConfirm = window.setTimeout(() => {
                if (self) {
                    self.setState({resetting: false})
                }
            }, 3000);
        });
    }

    render () {
        return (
            <Modal
                id="timer-modal"
                show={this.props.currentUser.user_id && !this.state.resetting &&
                    this.state.timeRemaining < TIMEOUT_WARNING}
                onHide={this.resetTimer.bind(this)}>
                <Modal.Body>
                    {this.state.timeRemaining / 1000}
                </Modal.Body>
            </Modal>
        );
    }
}

timerInfo = new TimerInfo();
TimerModal.defaultProps = {
    timerInfo
};

export {timerInfo};
export default TimerModal;