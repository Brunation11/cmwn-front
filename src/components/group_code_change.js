import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import CodeChangePopup from 'components/popups/code_change';

const HEADINGS = {
    UPDATE_CODE: 'Reset code for Group:',
    RESET_SUCCESS:
        'Code Reset for users in the group. They will need to update their password on next login.',
    RESET_FAILED: 'Update code failed.'
};
const ERRORS = {
    BAD_CODE: 'Sorry, there was a problem resetting group code.',
};

const COPY = (
    <span>
        To share this code with the users.
        <br />
        It will only be active for <span className="callout">24 hours!</span>
    </span>
);

class GroupCodeChange extends React.Component {
    constructor() {
        super();
        this.state = {code: ''};
    }

    submit() {
        var update;
        if (this.props.data._links.group_reset == null) {
            return;
        }
        update = HttpManager.POST({url: this.props.data._links.group_reset.href },
            {code: this.state.code});
        update.then(() => {
            this.refs.popup.showModal();
            Toast.success.call(this, HEADINGS.RESET_SUCCESS);
        }).catch(err => {
            Log.warn(HEADINGS.RESET_FAILED + (err.message ? ' Message: ' + err.message : ''), err);
            Toast.error(ERRORS.BAD_CODE);
        });
    }

    render() {
        if (!this.props.data._links.group_reset) {
            return null;
        }

        return (
            <Panel header={`${HEADINGS.UPDATE_CODE} ${this.props.data.title}`} className="standard"><form>
                    <div className="left">
                        <Input
                            type="text"
                            value={this.state.code}
                            id="reset-code"
                            placeholder="Access Code"
                            label="Reset Code"
                            validate="required"
                            ref="currentInput"
                            name="currentInput"
                            onChange={e => this.setState({code: e.target.value})}
                        />
                        <Button onClick={this.submit.bind(this)} className="green standard left">
                            Reset Code
                        </Button>
                        <CodeChangePopup
                            ref="popup"
                            copy={COPY}
                        />
                    </div>
            </form></Panel>
        );
    }
}

export default GroupCodeChange;
