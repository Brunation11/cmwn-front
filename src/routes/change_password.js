import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import History from 'components/history';
import Toast from 'components/toast';
import GLOBALS from 'components/globals';
import {Button, Input} from 'react-bootstrap';

import Layout from 'layouts/one_col';

import 'routes/change_password.scss';

const PAGE_UNIQUE_IDENTIFIER = 'change-password';

const LABELS = {
    NEW: 'NEW PASSWORD',
    CONFIRM: 'CONFIRM PASSWORD',
    TOGGLE: 'CHECK TO SHOW PASSWORD CHARACTERS'
};

const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.'
};

const CHANGE_COPY = {
    PART_ONE: 'You are required to change your password before using ',
    PART_TWO: 'ChangeMyWorldNow.com',
    PART_THREE: 'Please update your password using the form below to proceed.'
};

var mapStateToProps;
var Page;

export class UpdatePassword extends React.Component {
    constructor() {
        super();
        this.state = _.defaults({
            type: 'password',
            extraProps: {},
            currentPage: 'update-password',
            background: _.sample(['bkg-1', 'bkg-2'])
        });
    }

    componentDidMount() {
        if (this.props.currentUser && this.props.data && this.props.loading) {
            this.setState({
                currentUser: this.props.currentUser,
                data: this.props.data,
                loading: this.props.loading
            });
        }

        if (this.props.currentUser.user_id != null) {
            window.location.href = '/logout';
        }
    }

    handleOptionSelect(e) {
        if (this.state.type !== e.target.value) {
            this.setState({
                type: e.target.value
            });
        } else {
            this.setState({
                type: 'password'
            });
        }
    }

    isPassValid(password) {
        if (password === null || typeof (password) === 'undefined') return false;
        return password.length >= 8 && ~password.search(/[0-9]+/);
    }

    goToProfile() {
        History.replace('/profile?message=updated');
    }

    submit() {
        if (!this.isPassValid(this.refs.newPassword.getValue())) {
            this.setState({
                extraProps: {
                    bsStyle: 'error'
                }
            });
            Toast.error(ERRORS.TOO_SHORT);
        } else if (this.refs.confirmPassword.getValue() === this.refs.newPassword.getValue()) {
            HttpManager.POST({
                url: `${GLOBALS.API_URL}password`
            }, {
                'password': this.refs.newPassword.getValue(),
                'password_confirmation': this.refs.confirmPassword.getValue()
            }).then(() => {
                this.setState({
                    currentPage: 'confirm-re-login'
                });
            }).catch(err => {
                if (err.status === 0) {
                    //non-error response indicates password already changed successfully
                    this.setState({
                        currentPage: 'confirm-re-login'
                    });
                } else {
                    Log.warn(`Update password failed. ${err.message ? `Message: ${err.message}` : ''}`, err);
                    Toast.error(ERRORS.BAD_PASS);
                }
            });
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.NO_MATCH);
        }
    }

    renderConfirmReLogin() {
        return (
            <div className={`confirm-re-login ${this.state.background}`}>
                <div className="confirm-re-login-container">
                    <Button className="close-screen-button" onClick={this.goToProfile} />
                </div>
            </div>
        );
    }

    renderPasswordReset() {
        return (
            <div className={`update-password ${this.state.background}`}>
                <div className="update-password-container">
                    <div className="update-password-content">
                        <h1 className="header">UPDATE PASSWORD</h1>
                        <div className="copy-container">
                            <span className="copy">{CHANGE_COPY.PART_ONE}
                                <span className="link">{CHANGE_COPY.PART_TWO}</span>
                            </span>
                            <br />
                            <span className="copy">{CHANGE_COPY.PART_THREE}</span>
                        </div>
                        <form method="POST" className="update-password-form">
                            <Input
                                ref="newPassword"
                                name="newPassword"
                                id="newPassword"
                                type={this.state.type}
                                placeholder="PA******"
                                label={LABELS.NEW}
                                validate="required"
                                onFocus={e => e.target.placeholder = ''}
                                onBlur={e => e.target.placeholder = 'PA******'}
                                autoComplete="off"
                                {...this.state.extraProps}
                            />
                            <Input
                                ref="confirmPassword"
                                name="confirmPassword"
                                id="confirmPassword"
                                type={this.state.type}
                                placeholder="PA******"
                                label={LABELS.CONFIRM}
                                validate="required"
                                onFocus={e => e.target.placeholder = ''}
                                onBlur={e => e.target.placeholder = 'PA******'}
                                autoComplete="off"
                                {...this.state.extraProps}
                            />
                            <Input
                                type="radio"
                                ref="toggle"
                                name="toggle"
                                className="toggle-characters"
                                label={LABELS.TOGGLE}
                                value="text"
                                checked={this.state.type === 'text'}
                                onChange={this.handleOptionSelect.bind(this)}
                            />
                        </form>
                        <Button
                            id="submit-button"
                            className="submit-button"
                            onClick={this.submit.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        var page;

        if (this.state.currentPage === 'update-password') {
            page = this.renderPasswordReset;
        } else {
            page = this.renderConfirmReLogin;
        }

        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                {page.call(this)}
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(UpdatePassword);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
