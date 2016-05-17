import React from 'react';
import {Modal} from 'react-bootstrap';
import ClassNames from 'classnames';

import Log from 'components/log';

const COPY = {
    BUTTONS: {
        WORK: 'Work with Us',
        CONTACT: 'Contact Us',
        TERMS: 'Terms & Conditions'
    },
    MODALS: {
        WORK: <span><p>We are so excited about your interest to work with us!</p><p>Click <a href="mailto:&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#097;&#114;&#114;&#111;&#110;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;?subject=Work With Us!">here</a> to contact us.</p></span>,

        PRECAPTCHA: 'Thanks for your interest!',
        CONTACT: <span>
            <p>Postage can be sent to:</p>
            <p>21 W 46th Street, Suite 605<br />600 Third Ave<br /></p>
            <p>Or give us a call at &#40;&#54;&#52;&#54;&#41;&#32;&#56;&#54;&#49;&#45;&#48;&#53;&#55;&#49;</p>
            <p>Click <a href="mailto:&#105;&#110;&#102;&#111;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;">here</a> to contact us.</p>
        </span>,

        SIGNUP: <span><p>We are so excited about your interest to work with us!</p><p>Click <a href="mailto:&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#099;&#097;&#116;&#104;&#121;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;?subject=Sign up with CMWN&body=Thank you for your interest in Change My World Now!%0D%0A%0D%0AIf you would like to launch Change My World Now in your school please provide the following information and someone from our team will contact you.%0D%0A%0D%0AYour Name:%0D%0AYour School:%0D%0AYour Email:%0D%0ASchool Grades:%0D%0APrincipal Name:%0D%0ASchool Phone:%0D%0ACity/State:">here</a> to contact us.</p></span>
    }
};
var Footer = React.createClass({
    getInitialState: function () {
        return {
            viewOpen: false,
            workOpen: false,
            contactOpen: false,
            showContact: false
        };
    },
    componentDidUpdate: function () {
        try {
            this.renderCaptcha();
        } catch(err) {
            //captcha doesnt always clean itself up nicely, throws its own
            //unhelpful, unbreaking 'container not empty' error. Ignoring.
            Log.warn(err, 'Captcha not fully destroyed');
            return err;
        }
    },
    displayWork: function () {
        this.setState({ workOpen: true });
    },
    displayContact: function () {
        if (this.props.loggedIn) {
            this.setState({contactOpen: true, showContact: true});
            return;
        }
        this.setState({ contactOpen: true });
    },
    closeWork: function () {
        this.setState({ workOpen: false });
    },
    closeContact: function () {
        this.setState({ contactOpen: false });
    },
    renderCaptcha: function () {
        var captchas = document.getElementsByClassName('grecaptcha');
        if (captchas.length) {
            grecaptcha.render(captchas[0], {'sitekey': '6LdNaRITAAAAAInKyd3qYz8CfK2p4VauStHMn57l', callback: () => { //eslint-disable-line no-undef
                this.setState({showContact: true});
            }});
        }
    },
    render: function () {
        return (
            <div className="global-footer">
                <Modal show={this.state.workOpen} onHide={this.closeWork}>
                    <Modal.Body>
                        {COPY.MODALS.WORK}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.contactOpen} onHide={this.closeContact}>
                    <Modal.Body>
                        {COPY.MODALS.PRECAPTCHA}
                        <div className={ClassNames('grecaptcha', {hidden: this.props.loggedIn})}></div>
                        {this.state.showContact ? COPY.MODALS.CONTACT : ''}
                    </Modal.Body>
                </Modal>
                <footer className="links">
                    <a onClick={this.displayWork}>
                        {COPY.BUTTONS.WORK}
                    </a>
                    <a onClick={this.displayContact}>
                        {COPY.BUTTONS.CONTACT}
                    </a>
                    <a href="/terms" target="_blank">
                        {COPY.BUTTONS.TERMS}
                    </a>
                </footer>
            </div>
        );
    }
});

export default Footer;

