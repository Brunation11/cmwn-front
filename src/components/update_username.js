import React from 'react';
import {Panel, Button, Glyphicon} from 'react-bootstrap';
import Confirm from 'react-bootstrap-confirm';

import HttpManager from 'components/http_manager';

const CHANGE = 'Update your Username';

const BUTTONS = {
    CONFIRM: 'Yes, change it!',
    CANCEL: 'No, go back.',
    GET: 'Generate New Name',
    SET: 'Set {0} Selected as Username',
    LAST: 'Reset to {0}'
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            username: this.props.username,
            last: this.props.last
        };
    },
    reloadChildUsername: function () {
        HttpManager.GET().then(server => {}).catch(err => {});
    },
    setChildUsername: function () {
        HttpManager.GET().then(server => {}).catch(err => {});
    },
    updateAdultUsername: function () {
        HttpManager.GET().then(server => {}).catch(err => {});
    },
    renderAdult: function () {},
    renderChild: function () {
        return (
           <div>
                <Confirm.Component ref="confirm" title={CHANGE} sure={BUTTONS.CONFIRM} cancel={BUTTONS.CANCEL} />
                <Button onClick={this.reloadChildUsername}><Glyphicon glyph="repeat" /> {BUTTONS.GET}</Button>
                <Button onClick={this.setChildUsername}>{BUTTONS.SET}</Button>
           </div>
        );
    },
    render: function () {
        var displayUpdate;
        if (this.props.userType === 'CHILD') {
            displayUpdate = this.renderChild;
        } else {
            displayUpdate = this.renderAdult;
        }
        return (
           <Panel>
               {displayUpdate()}
           </Panel>
        );
    }
});

export default Page;


