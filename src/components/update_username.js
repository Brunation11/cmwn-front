import React from 'react';
import {Panel, Button, Glyphicon} from 'react-bootstrap';
import SweetAlert from 'sweetalert2';

import HttpManager from 'components/http_manager';
import Util from 'components/util';
import ClassNames from 'classnames';

import 'components/update_username.scss';

const IDENTIFIER = 'change-username';
const CHANGE = 'create a new username';
const CONFIRM_SET = 'Are you sure? Once you leave this page, you will not be able to change back to {0}.';
const BAD_UPDATE = 'Could not update your user name.';
// const CONFIRM_RESET = 'Are you sure? If you change back to {0} you may not be able to return to {1}.';

const BUTTONS = {
    CONFIRM: 'How about this one?',
    PREVIOUS: 'This name is still available!',
    ORIGINAL: 'You can also keep your original.',
    CANCEL: 'No, go back.',
    GET: 'Generate New Name',
    SET: 'Set {0} as my Username',
    LAST: 'Reset to {0}'
};

const COPY = {
    NOTE: 'Click to select the name you want.',
    DISCLAIMER: 'Note: Once you change your username, you won\'t be able to go back to your original.'
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            username: this.props.username.slice(0, -3),
            option: this.props.username.slice(0, -3),
            last: this.props.username.slice(0, -3),
            original: this.props.username.slice(0, -3)
        };
    },
    getDefaultProps: function () {
        return {
            copy: ''
        };
    },
    reloadChildUsername: function () {
        HttpManager.GET({url: 'https://api-dev.changemyworldnow.com/user-name'}).then(server => {
            this.setState({last: this.state.option, option: server.response.user_name});
        }).catch(err => {}); // eslint-disable-line
        this.setStyleOnClick();
    },
    setStyleOnClick: function () {
        this.setState({tooltipsOpen: true});
    },
    setChildUsername: function () {
        SweetAlert({
            title: 'Are you sure?',
            text: Util.formatString(CONFIRM_SET, this.state.original),
            type: 'warning',
            showConfirmButton: true,
            confirmButtonText: BUTTONS.CONFIRM,
            confirmButtonColor: '#47B72C',
            confirmButtonClass: 'cmwn-confirm float-shadow',
            showCancelButton: true,
            cancelButtonText: BUTTONS.CANCEL,
            cancelButtonColor: '#7829BB',
            cancelButtonClass: 'cmwn-cancel float-shadow',
            closeOnConfirm: false,
            buttonStyling: false
        }).then(isConfirm => {
            if (isConfirm) {
                HttpManager.POST({
                    url: 'https://api-dev.changemyworldnow.com/user-name'
                }, {
                    user_name: this.state.option // eslint-disable-line
                }).then(server => {
                    this.setState({
                        username: this.state.option
                    });
                    SweetAlert({
                        title: 'SAVED!',
                        text: ('Username Updated to ' + server.response.username + '!'),
                        type: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }).catch(err => {
                    SweetAlert({
                        title: 'OH NO!',
                        text: (BAD_UPDATE + (err.message ? ' Message: ' + err.message : '')),
                        type: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                });
            }
        });
    },
    resetLast: function () {
        this.setState({option: this.state.last, last: this.state.option});
    },
    resetOriginal: function () {
        this.setState({option: this.state.original, last: this.state.option});
    },
    updateAdultUsername: function () {
        HttpManager.GET().then(server => {}).catch(err => {}); // eslint-disable-line
    },
    renderAdult: function () {},
    renderChild: function () {
        return (
           <div className="update-username-container">
                <div className="left">
                    <Button className="purple username-btn username-picker generate" onClick={this.reloadChildUsername}>
                        <Glyphicon glyph="repeat" /> {BUTTONS.GET}
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" onClick={this.setChildUsername}>
                        {BUTTONS.CONFIRM}
                        <br />
                        <span className="username username-picker">
                            {this.state.option}
                        </span>
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" onClick={this.resetLast}>
                        {BUTTONS.PREVIOUS}
                        <br />
                        <span className="username username-picker">
                            {this.state.last}
                        </span>
                    </Button>
                    <br />
                    <Button className="green username-btn username-picker" onClick={this.resetOriginal}>
                        {BUTTONS.ORIGINAL}
                        <br />
                        <span className="username username-picker">
                            {this.state.original}
                        </span>
                    </Button>
                </div>
                <div className="right">
                    <div className={ClassNames('note', {open: this.state.tooltipsOpen})}>
                        <p>{COPY.NOTE}</p>
                        <p className="disclaimer">{COPY.DISCLAIMER}</p>
                    </div>
                </div>
           </div>
        );
    },
    render: function () {
        var displayUpdate;
//        if (this.props.userType === 'CHILD') {
        displayUpdate = this.renderChild;
//        } else {
//            displayUpdate = this.renderAdult;
//        }
        return (
           <Panel header={CHANGE} className={this.props.className + ' standard ' + IDENTIFIER}>
               {displayUpdate()}
           </Panel>
        );
    }
});

export default Page;

