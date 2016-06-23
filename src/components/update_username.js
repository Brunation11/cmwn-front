import React from 'react';
import {Input, Panel, Button, Glyphicon} from 'react-bootstrap';
import Alertify from 'alertify.js';

import HttpManager from 'components/http_manager';
import Util from 'components/util';
import Toast from 'components/toast';
import ClassNames from 'classnames';

import 'components/update_username.scss';

const IDENTIFIER = 'change-username';

const CHANGE = 'Update your Username';
const CONFIRM_SET = 'Are you sure? Once you leave this page, you will not be able to change back to {0}.';
const BAD_UPDATE = 'Could not update your user name.';
// const CONFIRM_RESET = 'Are you sure? If you change back to {0} you may not be able to return to {1}.';

const BUTTONS = {
    CONFIRM: 'Yes, change it!',
    CANCEL: 'No, go back.',
    GET: 'Generate New Name',
    SET: 'Set {0} as my Username',
    LAST: 'Reset to {0}'
};

var UpdateUsername = React.createClass({
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
        Alertify
            .okBtn(BUTTONS.CONFIRM)
            .cancelBtn(BUTTONS.CANCEL)
            .confirm(Util.formatString(CONFIRM_SET, this.state.original), () => {
                HttpManager.POST({url: 'https://api-dev.changemyworldnow.com/user-name'}, {user_name: this.state.option}).then(server => { // eslint-disable-line
                    this.setState({username: this.state.option});
                    Toast.spawn({addnCls: 'humane-flatty-success', waitForMove: false, timeout: 10000})('Username Updated to ' + server.response.username + '!');
                }).catch(err => {
                    Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                });
            }
        );
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
                    <Input
                        type="text"
                        value={this.state.option}
                        disabled
                        label="Current Username:"
                    />
                    <Button className="purple username-btn generate" onClick={this.reloadChildUsername}><Glyphicon glyph="repeat" /> {BUTTONS.GET}</Button>
                    <br />
                    <Button className="green username-btn submit" onClick={this.setChildUsername}>{Util.formatString(BUTTONS.CONFIRM)}</Button>
                    <br />
                    <Button className="blue alternate-usernames-btn username-btn" onClick={this.resetLast}>Select Last Option: {this.state.last}</Button>
                    <br />
                    <Button className="blue alternate-usernames-btn username-btn" onClick={this.resetOriginal}>Select Original: {this.state.original}</Button>
                </div>
                <div className="right">
                    <div className={ClassNames('note', {open: this.state.tooltipsOpen})}>
                        <p>love your new username? Be sure to click "YES, CHANGE IT!" to make it yours forever!</p>
                        <p className="disclaimer">Note: Once you choose to set the new username, you won't be able to change it again.</p>
                    </div>
                    <div className="reminder-container">
                        <p className={ClassNames('reminder', {animate: this.state.tooltipsOpen})}>Changed your mind? You can choose from the last choice or keep your same username!</p>
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

export default UpdateUsername;

