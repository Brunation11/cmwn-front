import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import CodeChangePopup from 'components/popups/code_change';

const HEADINGS = {
    UPDATE_CODE: 'Reset code for user',
};
const ERRORS = {
    BAD_CODE: 'Sorry, there was a problem resetting your code.',
};

class CodeChange extends React.Component {
    constructor() {
        super();
        this.state = {code: ''};
    }

    submit() {
        var update;
        if (this.props.data._links.reset == null) {
            return;
        }
        update = HttpManager.POST({url: this.props.data._links.reset.href },
            {email: this.props.data.email, code: this.state.code});
        update.then(() => {
            this.refs.popup.showModal();
            Toast.success.call(this,
                'Code Reset for user. They will need to update their password on next login.');
        }).catch(err => {
            Log.warn('Update code failed.' + (err.message ? ' Message: ' + err.message : ''), err);
            Toast.error(ERRORS.BAD_CODE);
        });
    }

    render() {
        if (this.props.currentUser && this.props.currentUser.user_id === this.props.user_id ||
            this.props.data._links.reset == null) {
            return null;
        }
        return (
            <Panel header={HEADINGS.UPDATE_CODE} className="standard"><form>
                    <Input
                        type="text"
                        value={this.state.code}
                        id="reset-code"
                        placeholder="code"
                        label="Reset Code"
                        validate="required"
                        ref="currentInput"
                        name="currentInput"
                        onChange={e => this.setState({code: e.target.value})}
                    />
                    <Button onClick={this.submit.bind(this)} id="reset-code-btn">Reset Code</Button>
                    <CodeChangePopup
                        ref="popup"
                    />
            </form></Panel>
        );
    }
}

export default CodeChange;
