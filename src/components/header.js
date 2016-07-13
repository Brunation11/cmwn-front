import React from 'react';
import {Input, Button, Modal} from 'react-bootstrap';
import ClassNames from 'classnames';

import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';

export const COPY = {
    BUTTONS: {
        WORK: 'Work with Us',
        CONTACT: 'Contact Us',
        SIGNUP: 'School Signup',
        TERMS: 'Terms & Conditions',
        LOGIN: 'Login',
        PROFILE: 'Profile'
    },
    ALERTS: {
        LOGIN: {
            TEXT: 'Thanks for your interest! We\'ll be launching very soon, and will keep you notified of ' +
            'updates!',
            ACTION: 'close'
        },
        SIGNUP: {
            TEXT: 'We would be happy to help you start the process. Give us a call at xxx for more details!',
            ACTION: 'close'
        }
    },
    MODALS: {
        WORK: <span>
            <p>We are so excited about your interest to work with us!</p>
            <p dangerouslySetInnerHTML={{__html: 'Click <a href=\'mailto:&#106;&#111;&#110;&#105;&#064;' +
                '&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;' +
                '&#046;&#099;&#111;&#109;?subject=Work With Us!\'>here</a> to contact us.'}}>
            </p>
        </span>,

        PRECAPTCHA: 'Thanks for your interest! Please check the box below to display contact information.',
        CONTACT: <span>
            <p>Postage can be sent to:</p>
            <p>21 W 46th Street, Suite 605<br />New York, New York 10036<br /></p>
            <p>Or give us a call at &#40;&#54;&#52;&#54;&#41;&#32;&#56;&#54;&#49;&#45;&#48;&#53;&#55;&#49;</p>
            <p dangerouslySetInnerHTML={{__html: 'Click <a href=\'mailto:&#105;&#110;&#102;&#111;&#064;' +
                '&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#106;&#111;' +
                '&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;' +
                '&#109;\'>here</a> to contact us.'}}>
            </p>
        </span>,

        SIGNUP: <span>
            <p>We are so excited about your interest to work with us!</p>
            <p dangerouslySetInnerHTML={{__html: 'Click <a href=\'mailto:&#106;&#111;&#110;&#105;&#064;' +
                '&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#099;&#097;' +
                '&#116;&#104;&#121;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;' +
                '&#111;&#109;?subject=Sign up with CMWN&body=Thank you for your interest in Change My ' +
                'World Now!%0D%0A%0D%0AIf you would like to launch Change My World Now in your school ' +
                'please provide the following information and someone from our team will contact you.' +
                '%0D%0A%0D%0AYour Name:%0D%0AYour School:%0D%0AYour Email:%0D%0ASchool Grades:' +
                '%0D%0APrincipal Name:%0D%0ASchool Phone:%0D%0ACity/State:\'>here</a> to contact us.'}}>
            </p>
        </span>
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginOpen: false,
            signupOpen: false,
            verified: false
        };
    }

    componentDidMount() {
        this.renderCaptcha();
    }

    componentDidUpdate() {
        try {
            this.renderCaptcha();
        } catch(err) {
            //captcha doesnt always clean itself up nicely, throws its own
            //unhelpful, unbreaking 'container not empty' error. Ignoring.
            Log.warn(err, 'Captcha not fully destroyed');
            return err;
        }
    }

    login() {
        if (this.props.currentUser.user_id) {
            History.push('/profile');
        } else {
            History.push('/login');
        }
    }

    renderCaptcha() {
        var captchas;
        if (this.state.verified) {
            return;
        } else {
            captchas = document.getElementsByClassName('grecaptcha');
            if (captchas.length) {
                grecaptcha.render(captchas[0], {
                    'sitekey': '6LdNaRITAAAAAInKyd3qYz8CfK2p4VauStHMn57l',
                    callback: () => { //eslint-disable-line no-undef
                        this.setState({
                            verified: true
                        });
                    }
                });
            }
        }
    }

    displayWorkModal() {
        this.setState({workOpen: true});
    }

    displayContactModal() {
        this.setState({contactOpen: true});
    }

    displaySignupModal() {
        this.setState({signupOpen: true});
    }

    hideWorkModal() {
        this.props.closeWork();
        this.setState({workOpen: false});
    }

    hideContactModal() {
        this.props.closeContact();
        this.setState({contactOpen: false});
    }

    signupAlert() {
        Toast.success(COPY.ALERTS.SIGNUP.TEXT);
    }

    render() {
        var loginButtonCopy = this.props.currentUser.user_id ?
            COPY.BUTTONS.PROFILE : COPY.BUTTONS.LOGIN;

        return (
            <div>
                <Modal id="work-modal" show={this.props.workOpen || this.state.workOpen}
                       onHide={this.hideWorkModal.bind(this)}>
                    <Modal.Body>
                        {COPY.MODALS.WORK}
                    </Modal.Body>
                </Modal>
                <Modal id="contact-modal" show={this.props.contactOpen || this.state.contactOpen}
                    onHide={this.hideContactModal.bind(this)}>
                    <Modal.Body>
                        {this.state.verified ? '' : COPY.MODALS.PRECAPTCHA}
                        <div className={ClassNames('grecaptcha', {
                            hidden: (this.props.loggedIn || this.state.verified)
                        })}></div>
                        {this.state.verified ? COPY.MODALS.CONTACT : ''}
                    </Modal.Body>
                </Modal>
                <Modal id="signup-modal" show={this.state.signupOpen}
                    onHide={this.setState.bind(this, {signupOpen: false})}>
                    <Modal.Body>
                        {COPY.MODALS.SIGNUP}
                    </Modal.Body>
                </Modal>
                <h1 className="fallback">Change My World Now</h1>
                <div className="links">
                    <a href="#" onClick={this.displayWorkModal.bind(this)}>
                        {COPY.BUTTONS.WORK}
                    </a>
                    <a href="#" onClick={this.displayContactModal.bind(this)}>
                        {COPY.BUTTONS.CONTACT}
                    </a>
                    <a href="/terms" target="_blank">
                        {COPY.BUTTONS.TERMS}
                    </a>
                </div>
                <div className="actions">
                    <Button id="signup" className="green"
                        onClick={this.displaySignupModal.bind(this)}>
                        {COPY.BUTTONS.SIGNUP}
                    </Button>
                    <Button id="login" className="purple" onClick={this.login.bind(this)}>
                        {loginButtonCopy}
                    </Button>
                </div>
            </div>
        );
    }
}

Header.defaultProps = {
    workOpen: false,
    contactOpen: false,
};

export default Header;
