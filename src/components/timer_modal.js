import React from 'react';

import { Button, Modal } from 'react-bootstrap';

class TimerModal extends React.Component {
    constructor() {
        super();
        this.state.lastTime = new Date();
    }

    // https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
    getTimeRemaining() {
        var t = Date.parse(this.state.lastTime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    render() {
        return (
            <Modal id="timer-modal" show={this.lastTime}>
                Hellow
            </Modal>
        );
    }
}

export default TimerModal;