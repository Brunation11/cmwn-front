import React from 'react';
import {Input, Panel, Button, Glyphicon} from 'react-bootstrap';
import Alertify from 'alertify.js';

import HttpManager from 'components/http_manager';
import Util from 'components/util';

import 'components/update_username.scss';

const IDENTIFIER = 'change-username';

const CHANGE = 'Update your Username';
const CONFIRM_SET = 'Are you sure? Once you leave this page, you will not be able to change back to {0}.';
const CONFIRM_RESET = 'Are you sure? If you change back to {0} you may not be able to return to {1}.';

const BUTTONS = {
    CONFIRM: 'Yes, change it!',
    CANCEL: 'No, go back.',
    GET: 'Generate New Name',
    SET: 'Set {0} as my Username',
    LAST: 'Reset to {0}'
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
        }).catch(err => {});
    },
    setChildUsername: function () {
        Alertify
            .okBtn(BUTTONS.CONFIRM)
            .cancelBtn(BUTTONS.CANCEL)
            .confirm(Util.formatString(CONFIRM_SET, this.state.original), () => {
                HttpManager.POST({url: 'https://api-dev.changemyworldnow.com/user-name'}, {user_name: this.state.option}).then(server => {
                    this.setState({username: this.state.option});
                }).catch(err => {});
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
        HttpManager.GET().then(server => {}).catch(err => {});
    },
    renderAdult: function () {},
    renderChild: function () {
        return (
           <div>
                <h3>{this.props.copy}</h3>
                <p>Current Username: {this.state.username}</p>
                <p>Original Username: {this.state.original}</p>
                <b>Current Option: (love this option? Be sure to remember to hit "set" to make it yours forever!)</b>
                <Input
                    type="text"
                    value={this.state.option}
                    disabled
                />
                <Button className="standard purple" onClick={this.reloadChildUsername}><Glyphicon glyph="repeat" /> {BUTTONS.GET}</Button>
                <Button className="standard green" onClick={this.setChildUsername}>{Util.formatString(BUTTONS.SET, this.state.option)}</Button>
                <p>
                    <br />
                    <a onClick={this.resetLast}>Select Last Option: {this.state.last}</a>
                    <br />
                    <a onClick={this.resetOriginal}>Select Original: {this.state.original}</a>
                </p>
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
           <Panel  header={CHANGE} className={this.props.className + " standard " + IDENTIFIER}>
               {displayUpdate()}
           </Panel>
        );
    }
});

export default Page;

