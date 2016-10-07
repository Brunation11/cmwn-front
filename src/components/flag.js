import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Modal, Button, Input} from 'react-bootstrap'; // eslint-disable-line

import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';

import 'components/flag.scss';

const COPY = {
    SUCCESS: 'You have successfully flagged this image.',
    ERROR: 'Looks like there was an issue flagging this image.',
    OFFENSIVE: 'I FOUND THIS IMAGE OFFENSIVE.',
    INAPPROPRIATE: 'THE IMAGE USED WAS INAPPROPRIATE.',
    OTHER: 'I HAVE ANOTHER REASON:',
    LABEL: 'Why are you reporting this image?'
};

export default class Flag extends React.Component {
    constructor() {
        super();

        this.state = _.defaults({
            reason: '',
        });
    }

    componentDidMount() {
        if (this.props.data) this.setState({data: this.props.data});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data !== this.props.data) this.setState({data: nextProps.data});
    }

    handleOptionSelect(e) {
        if (this.state.reason !== e.target.value) {
            this.setState({
                reason: e.target.value
            });
        }
    }

    showModal() {
        this.setState({flagFormOpen: true});
    }

    hideModal() {
        this.setState({flagFormOpen: false});
    }

    submitFlag() {
        if (!this.state.reason) {
            return Toast.error('Looks like you haven\'t selected a reason for flagging this image');
        }

        HttpManager.POST({
            url: `${GLOBALS.API_URL}flag`,
            handleErrors: false
        }, {
            flaggee: this.state.data.friend_id,
            reason: this.state.reason,
            url: this.state.data.image
        }).then (() => {
            Toast.success(COPY.SUCCESS);
        }).catch (e => {
            Toast.error(COPY.ERROR);
            Log.error(e, 'Unable to flag');
        });
    }

    renderFlagForm() {
        return (
            <form
                method="POST"
                ref="flag-form"
                className={ClassNames('flag-form', {
                    offensive: this.state.reason === COPY.OFFENSIVE,
                    inappropriate: this.state.reason === COPY.INAPPROPRIATE,
                    other: this.state.reason !== '' &&
                    this.state.reason !== COPY.OFFENSIVE &&
                    this.state.reason !== COPY.INAPPROPRIATE
                })}
            >
                <h1><strong>{COPY.LABEL}</strong></h1>
                <Input
                    type="radio"
                    ref="inappropriate"
                    name="inappropriate"
                    className="radio-inappropriate"
                    label={COPY.INAPPROPRIATE}
                    value={COPY.INAPPROPRIATE}
                    checked={this.state.reason === COPY.INAPPROPRIATE}
                    onChange={this.handleOptionSelect.bind(this)}
                />
                <Input
                    type="radio"
                    ref="offensive"
                    name="offensive"
                    className="radio-offensive"
                    label={COPY.OFFENSIVE}
                    value={COPY.OFFENSIVE}
                    checked={this.state.reason === COPY.OFFENSIVE}
                    onChange={this.handleOptionSelect.bind(this)}
                />
                <Input
                    type="textarea"
                    ref="other"
                    name="other"
                    className="input-other"
                    label={COPY.OTHER}
                    placeholder="Type your concern here."
                    onChange={this.handleOptionSelect.bind(this)}
                />
                <Button className="confirm" onClick={this.submitFlag.bind(this)}>Confirm</Button>
                <Button className="cancel" onClick={this.hideModal.bind(this)}>Cancel</Button>
            </form>
        );
    }

    render() {
        if (!this.state.data) return null;
        return (
            <div className="flag-container">
                <Modal
                    className="flag-form-modal"
                    show={this.state.flagFormOpen}
                    onHide={this.hideModal.bind(this)}
                    keyboard={false}
                    backdrop="static"
                    id="flag-form-modal"
                >
                    <Modal.Body>
                        {this.renderFlagForm()}
                    </Modal.Body>
                </Modal>
                <Button
                    className="flag-button"
                    onClick={this.showModal.bind(this)}
                />
                {this.props.children}
            </div>
        );
    }
}

// endpoint requirements for what will be submitted = [flaggee user_id, reason, image_url]
// keys for post = [flagger, flaggee, reason, url]
