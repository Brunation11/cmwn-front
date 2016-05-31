import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {Input, Carousel, CarouselItem, Button, Modal} from 'react-bootstrap';
import Shortid from 'shortid';

import Toast from 'components/toast';
import Log from 'components/log';
import History from 'components/history';
import Store from 'components/store';

import 'routes/home.scss';
import LOGO_URL from 'media/header-logo.png';
import LOGO_HEADER from 'media/header-header.png';
import SLIDE_A_BG_URL from 'media/home/green_background.png';
import SLIDE_B_BG_URL from 'media/home/purple_background.png';
import SLIDE_C_BG_URL from 'media/home/blue_background.png';
import KIDS_URL from 'media/home/GroupKids_Homepage.png';

import PARTNER_1PERCENT from 'media/home/1percent_@2x.png';
import PARTNER_ADINASDECK from 'media/home/adinasdeck_@2x.png';
import PARTNER_BNF_LOGO from 'media/home/BNF_LOGO_@2x.png';
import PARTNER_CI4Y_SIDE_RGBWEB from 'media/home/CI4Y_side_RGBweb_@2x.png';
import PARTNER_DON_MC_PHERSON from 'media/home/Don-McPherson_@2x.png';
import PARTNER_ECO_SCHOOLS_LOGO from 'media/home/EcoSchools_logo_@2x.png';
import PARTNER_GG_PARTNERS from 'media/home/GGpartners_@2x.png';
import PARTNER_GIRL_EFFECT from 'media/home/GirlEffect_@2x.png';
import PARTNER_HUM from 'media/home/HUM_@2x.png';
import PARTNER_INLEASHED from 'media/home/inleashed_@2x.png';
import PARTNER_NATIONAL_WILDLIFE_FEDERATION_LOGO from 'media/home/National_Wildlife_Federation_logo_@2x.png';
import PARTNER_PEACE_JAM from 'media/home/peacejam_@2x.png';
import PARTNER_PG_LOGO from 'media/home/PGlogo_@2x.png';
import PARTNER_PROJECT_GIRL_LOGO from 'media/home/projectgirllogo_@2x.png';
import PARTNER_SHES_THE_FIRST_LOGO from 'media/home/ShesTheFirst_Logo-pinkstar_@2x.png';
import PARTNER_STOW_IT_DONT_THROWIT from 'media/home/StowItDontThrowIt_@2x.png';
import PARTNER_TEACHING_THE_WORLD_THROUGH_ART from 'media/home/teachingtheworldthroughart_@2x.png';

const COPY = {
    BUTTONS: {
        WORK: 'Work with Us',
        CONTACT: 'Contact Us',
        DEMO: 'Demo',
        SIGNUP: 'School Signup',
        WATCH: 'Watch the video',
        TERMS: 'Terms & Conditions',
        LOGIN: 'Login',
        PROFILE: 'Profile'
    },
    SLIDES: [
        {
            HEADING: <span>Change my world now is the kids' social activation platform for the <span className="em">now</span> generation</span>,
            /*I don't know that i love this convention for copy with arbitrary styling. It's clean but doesn't allow for programmatic transformation of text by the js below*/
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: <span>Be the hero<br />of your<br />own story</span>,
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: 'Start changing the world now!',
            TEXT: '',
            ALT: ''
        },
    ],
    HEADINGS: {
        WORLD_HELP: <span>The World needs help and we believe it is the kids of today who are going to be the ones to save it!</span>,
        SHINE: 'It\'s Time to Shine',
        PARTNERS: 'Our Partners'
    },
    PARAGRAPHS: [
        <span>At <strong>Change My World Now</strong>, our team is committed to giving this next generation everything they need to take charge of their world and to become compassionate, responsible stewards of the future they are creating. With safety and parents in mind, we have built a place where kids, ages 6-14, can discover the world around them and take action through our amazing games and content.</span>
    ],
    ALERTS: {
        LOGIN: {
            TEXT: 'Thanks for your interest! We\'ll be launching very soon, and will keep you notified of updates!',
            ACTION: 'close'
        },
        SIGNUP: {
            TEXT: 'We would be happy to help you start the process. Give us a call at xxx for more details!',
            ACTION: 'close'
        }
    },
    MODALS: {
        WORK: <span><p>We are so excited about your interest to work with us!</p><p>Click <a href="mailto:&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#097;&#114;&#114;&#111;&#110;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;?subject=Work With Us!">here</a> to contact us.</p></span>,

        PRECAPTCHA: 'Thanks for your interest! Please check the box below to display contact information.',
        CONTACT: <span>
            <p>Postage can be sent to:</p>
            <p>21 W 46th Street, Suite 605<br />New York, New York 10036<br /></p>
            <p>Or give us a call at &#40;&#54;&#52;&#54;&#41;&#32;&#56;&#54;&#49;&#45;&#48;&#53;&#55;&#49;</p>
            <p>Click <a href="mailto:&#105;&#110;&#102;&#111;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;">here</a> to contact us.</p>
        </span>,

        SIGNUP: <span><p>We are so excited about your interest to work with us!</p><p>Click <a href="mailto:&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#099;&#097;&#116;&#104;&#121;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;?subject=Sign up with CMWN&body=Thank you for your interest in Change My World Now!%0D%0A%0D%0AIf you would like to launch Change My World Now in your school please provide the following information and someone from our team will contact you.%0D%0A%0D%0AYour Name:%0D%0AYour School:%0D%0AYour Email:%0D%0ASchool Grades:%0D%0APrincipal Name:%0D%0ASchool Phone:%0D%0ACity/State:">here</a> to contact us.</p></span>
    }
};

const SOURCES = {
    LOGO: '',
    SLIDEBG: [
        SLIDE_A_BG_URL,
        SLIDE_B_BG_URL,
        SLIDE_C_BG_URL
    ],
    SHINE: '',
    PARTNERS: [
        PARTNER_NATIONAL_WILDLIFE_FEDERATION_LOGO,
        PARTNER_ECO_SCHOOLS_LOGO,
        PARTNER_1PERCENT,
        PARTNER_GIRL_EFFECT,
        PARTNER_HUM,
        PARTNER_PEACE_JAM,
        PARTNER_BNF_LOGO,
        PARTNER_ADINASDECK,
        PARTNER_CI4Y_SIDE_RGBWEB,
        PARTNER_DON_MC_PHERSON,
        PARTNER_GG_PARTNERS,
        PARTNER_INLEASHED,
        PARTNER_PG_LOGO,
        PARTNER_PROJECT_GIRL_LOGO,
        PARTNER_SHES_THE_FIRST_LOGO,
        PARTNER_STOW_IT_DONT_THROWIT,
        PARTNER_TEACHING_THE_WORLD_THROUGH_ART
    ]
};

var Home = React.createClass({
    getInitialState: function () {
        return {
            viewOpen: false,
            workOpen: false,
            contactOpen: false
        };
    },
    openViewModal: function () {
        this.setState({viewOpen: true});
    },
    openModal: function (id) {
        var state;

        state = {};
        state[id + 'Open'] = true;
        this.setState(state);
    },
    closeWork: function () {
        this.setState({ workOpen: false });
    },
    closeContact: function () {
        this.setState({ contactOpen: false });
    },
    render: function () {
        return (
            <div id="home" className="home">
                <Modal show={this.state.viewOpen} onHide={() => this.setState({viewOpen: false})}>
                    <Modal.Body>
                        <iframe id="viddler-b9cd1cb6" src="//www.viddler.com/embed/b9cd1cb6/?f=1&amp;autoplay=1&amp;player=simple&amp;secret=54225444&amp;make_responsive=0" width="100%" height="300" frameBorder="0" scrolling="no" allowFullScreen="1"></iframe>
                    </Modal.Body>
                </Modal>
                <div className="global-header">
                    <div className="logo" ><Link to={this.props.logoLink} ><img alt="Change My World Now" src={LOGO_URL} />Change My World Now</Link></div>
                    <div className="headerLogo"><Link to={this.props.logoLink} ><img alt="Change My World Now" src={LOGO_HEADER} /><span className="read">Change My World Now</span></Link></div>
                    <Header workOpen={this.state.workOpen} contactOpen={this.state.contactOpen} closeWork={this.closeWork} closeContact={this.closeContact} />
                </div>
                <Carousel>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[0]} />
                        <div className="content-group centered sweater">
                            <div>
                                <h2>{COPY.SLIDES[0].HEADING}</h2>
                                <Button className="purple" onClick={this.openViewModal}>
                                    {COPY.BUTTONS.WATCH}
                                </Button>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[1]} />
                        <div className="content-group centered sweater">
                            <h2>{COPY.SLIDES[1].HEADING}</h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[2]} />
                        <div className="content-group centered sweater">
                            <h2>{COPY.SLIDES[2].HEADING}</h2>
                        </div>
                    </CarouselItem>
                </Carousel>
                <div className="sweater">
                    <Layout openModal={this.openModal} />
                </div>
            </div>
        );
    }
});

var Header = React.createClass({
    getInitialState: function () {
        return {
            loginOpen: false,
            signupOpen: false,
            showContact: false
        };
    },
    getDefaultProps: function () {
        return {
            workOpen: false,
            contactOpen: false,
        };
    },
    componentDidMount: function () {
        this.renderCaptcha();
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
    login: function () {
        if (Store.getState().currentUser.user_id) {
            History.push('/profile');
        } else {
            History.push('/login');
        }
    },
    renderCaptcha: function () {
        var captchas = document.getElementsByClassName('grecaptcha');
        if (captchas.length) {
            grecaptcha.render(captchas[0], {'sitekey': '6LdNaRITAAAAAInKyd3qYz8CfK2p4VauStHMn57l', callback: () => { //eslint-disable-line no-undef
                this.setState({showContact: true});
            }});
        }
    },
    displayWorkModal: function () {
        this.setState({workOpen: true});
    },
    displayContactModal: function () {
        this.setState({contactOpen: true});
    },
    displaySignupModal: function () {
        this.setState({signupOpen: true});
    },
    hideWorkModal: function () {
        this.props.closeWork();
        this.setState({workOpen: false});
    },
    hideContactModal: function () {
        this.props.closeContact();
        this.setState({contactOpen: false, showContact: false});
    },
    loginAlert: function () {
        if (Store.getState().currentUser.user_id) {
            History.replace('/profile');
        } else {
            History.replace('/login');
        }
    },
    launchDemo: function () {
        this.setState({demoOpen: true});
    },
    confirmDemo: function () {
        this.login(this.state.demoText);
        this.setState({demoOpen: false});
    },
    signupAlert: function () {
        Toast.success(COPY.ALERTS.SIGNUP.TEXT);
    },
    render: function () {
        var loginButtonCopy = Store.getState().currentUser.user_id ? COPY.BUTTONS.PROFILE : COPY.BUTTONS.LOGIN;
        return (
            <div>
                <Modal show={this.state.demoOpen} onHide={this.confirmDemo}>
                    <Modal.Body>
                        <h2 class="access">Please enter your Special Access Code</h2>
                        <Input
                            ref="demoCode"
                            type="text"
                            value={this.state.demoText}
                            onChange={e => this.setState({demoText: e.target.value})} //eslint-disable-line camelcase
                        />
                        <Button onClick={this.confirmDemo}> Submit </Button>
                    </Modal.Body>
                </Modal>
                <Modal show={this.props.workOpen || this.state.workOpen} onHide={this.hideWorkModal}>
                    <Modal.Body>
                        {COPY.MODALS.WORK}
                    </Modal.Body>
                </Modal>
                <Modal show={this.props.contactOpen || this.state.contactOpen} onHide={this.hideContactModal}>
                    <Modal.Body>
                        {COPY.MODALS.PRECAPTCHA}
                        <div className="grecaptcha"></div>
                        {this.state.showContact ? COPY.MODALS.CONTACT : ''}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.signupOpen} onHide={() => this.setState({signupOpen: false})}>
                    <Modal.Body>
                        {COPY.MODALS.SIGNUP}
                    </Modal.Body>
                </Modal>
                <h1 className="fallback">Change My World Now</h1>
                <div className="links">
                    <a href="#" onClick={this.displayWorkModal}>
                        {COPY.BUTTONS.WORK}
                    </a>
                    <a href="#" onClick={this.displayContactModal}>
                        {COPY.BUTTONS.CONTACT}
                    </a>
                    <a href="/terms" target="_blank">
                        {COPY.BUTTONS.TERMS}
                    </a>
                </div>
                <div className="actions">
                    <Button id="signup" className="green" onClick={this.displaySignupModal}>
                        {COPY.BUTTONS.SIGNUP}
                    </Button>
                    <Button id="login" className="hidden" onClick={this.loginAlert}>
                        {loginButtonCopy}
                    </Button>
                    <Button id="demo" className="purple" onClick={this.login}>
                        {loginButtonCopy}
                    </Button>
                </div>
            </div>
        );
    }
});

var Layout = React.createClass({
    displayWorkModal: function () {
        this.props.openModal('work');
    },
    displayContactModal: function () {
        this.props.openModal('contact');
    },
    render: function () {
        return (
            <div className="layout">
                <div className="content">
                    <div className="content-group message">
                        <img alt="Change My World Now" src={KIDS_URL} />
                        <h2>{COPY.HEADINGS.WORLD_HELP}</h2>
                        {_.map(COPY.PARAGRAPHS, text => <p key={Shortid.generate()}>{text}</p>)}
                    </div>
                    <div className="content-group partners">
                        <h2>{COPY.HEADINGS.PARTNERS}</h2>
                        <div className="logos">
                            {_.map(SOURCES.PARTNERS, url => <div className="cell" style={{backgroundImage: `url(${url})`}} key={Shortid.generate()}></div>)}
                        </div>
                    </div>
                    <footer className="links">
                        <a href="#" onClick={this.displayWorkModal}>
                            {COPY.BUTTONS.WORK}
                        </a>
                        <a href="#" onClick={this.displayContactModal}>
                            {COPY.BUTTONS.CONTACT}
                        </a>
                        <a href="/terms" target="_blank">
                            {COPY.BUTTONS.TERMS}
                        </a>
                    </footer>
                </div>
            </div>
        );
    }
});

export default Home;
