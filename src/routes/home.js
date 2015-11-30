import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {Carousel, CarouselItem, Button, Modal} from 'react-bootstrap';

import Toast from 'components/toast';

import 'routes/home.scss';
import LOGO_URL from 'media/logo.png';
import SLIDE_A_BG_URL from 'media/home/green_background.jpg';
import SLIDE_B_BG_URL from 'media/home/purple_background.jpg';
import SLIDE_C_BG_URL from 'media/home/blue_background.jpg';
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
        LOGIN: 'Login',
        SIGNUP: 'School Signup',
        WATCH: 'Watch the video'
    },
    SLIDES: [
        {
            HEADING: <span>Change my world now is the kids' soical activation platform for the <span className="em">now</span> generation</span>,
            /*I don't know that i love this convention for copy with arbitrary styling. It's clean but doesn't allow for programmatic transformation of text by the js below*/
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: 'Be the hero of your own story',
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

        CONTACT: <span>
            <p>Postage can be sent to:</p>
            <p>600 Third Ave<br />2nd Floor<br />New York, NY 10016<br /></p>
            <p>Or give us a call at (646) 861-0571</p>
            <p>Click <a href="mailto:&#105;&#110;&#102;&#111;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;,&#106;&#111;&#110;&#105;&#064;&#103;&#105;&#110;&#097;&#115;&#105;&#110;&#107;&#046;&#099;&#111;&#109;">here</a> to contact us.</p>
        </span>,
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
        PARTNER_1PERCENT,
        PARTNER_ADINASDECK,
        PARTNER_BNF_LOGO,
        PARTNER_CI4Y_SIDE_RGBWEB,
        PARTNER_DON_MC_PHERSON,
        PARTNER_ECO_SCHOOLS_LOGO,
        PARTNER_GG_PARTNERS,
        PARTNER_GIRL_EFFECT,
        PARTNER_HUM,
        PARTNER_INLEASHED,
        PARTNER_NATIONAL_WILDLIFE_FEDERATION_LOGO,
        PARTNER_PEACE_JAM,
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
            contactOpen: false,
            shouldPlay: false
        };
    },
    openViewModal: function () {
        this.setState({viewOpen: true, shouldPlay: true});
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
            <div className="home">
                <Modal show={this.state.viewOpen} onHide={() => this.setState({viewOpen: false, shouldPlay: false})}>
                    <Modal.Body>
                        <iframe id="viddler-b9cd1cb6" src="//www.viddler.com/embed/b9cd1cb6/?f=1&amp;autoplay=1&amp;player=simple&amp;secret=54225444&amp;make_responsive=0" width="100%" height="300" frameBorder="0" scrolling="no" allowFullScreen="1"></iframe>
                    </Modal.Body>
                </Modal>
                <div className="global-header">
                    <div className="logo" ><Link to="/" ><img alt="Change My World Now" src={LOGO_URL} />Change My World Now</Link></div>
                    <Header workOpen={this.state.workOpen} contactOpen={this.state.contactOpen} closeWork={this.closeWork} closeContact={this.closeContact} />
                </div>
                <Carousel>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[0]} />
                        <div className="content-group sweater">
                            <h2>{COPY.SLIDES[0].HEADING}</h2>
                            <p>
                                {COPY.SLIDES[0].TEXT}
                            </p>
                            <Button className="purple" onClick={this.openViewModal}>
                                {COPY.BUTTONS.WATCH}
                            </Button>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[1]} />
                        <div className="content-group sweater">
                            <h2>{COPY.SLIDES[1].HEADING}</h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[2]} />
                        <div className="content-group sweater">
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
            signupOpen: false
        };
    },
    getDefaultProps: function () {
        return {
            workOpen: false,
            contactOpen: false,
        };
    },
    displayWorkModal: function () {
        this.setState({workOpen: true});
    },
    displayContactModal: function () {
        this.setState({contactOpen: true});
    },
    hideWorkModal: function () {
        this.props.closeWork();
        this.setState({workOpen: false});
    },
    hideContactModal: function () {
        this.props.closeContact();
        this.setState({contactOpen: false});
    },
    loginAlert: function () {
        Toast.success(COPY.ALERTS.LOGIN.TEXT);
    },
    signupAlert: function () {
        Toast.success(COPY.ALERTS.SIGNUP.TEXT);
    },
    render: function () {
        return (
            <div>
                <Modal show={this.props.workOpen || this.state.workOpen} onHide={this.hideWorkModal}>
                    <Modal.Body>
                        {COPY.MODALS.WORK}
                    </Modal.Body>
                </Modal>
                <Modal show={this.props.contactOpen || this.state.contactOpen} onHide={this.hideContactModal}>
                    <Modal.Body>
                        {COPY.MODALS.CONTACT}
                    </Modal.Body>
                </Modal>
                <h1 className="fallback">Change My World Now</h1>
                <div className="links">
                    <Link onClick={this.displayWorkModal}>
                        {COPY.BUTTONS.WORK}
                    </Link>
                    <Link onClick={this.displayContactModal}>
                        {COPY.BUTTONS.CONTACT}
                    </Link>
                </div>
                <div className="actions">
                    <Button className="green" onClick={this.signupAlert}>
                        {COPY.BUTTONS.SIGNUP}
                    </Button>
                    <Button className="purple" onClick={this.loginAlert}>
                        {COPY.BUTTONS.LOGIN}
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
                        {_.map(COPY.PARAGRAPHS, text => <p>{text}</p>)}
                    </div>
                    <div className="content-group partners">
                        <h2>{COPY.HEADINGS.PARTNERS}</h2>
                        <div className="logos">
                            {_.map(SOURCES.PARTNERS, url => <div className="cell" style={{backgroundImage: `url(${url})`}}></div>)}
                        </div>
                    </div>
                    <footer className="links">
                        <Link onClick={this.displayWorkModal}>
                            {COPY.BUTTONS.WORK}
                        </Link>
                        <Link onClick={this.displayContactModal}>
                            {COPY.BUTTONS.CONTACT}
                        </Link>
                    </footer>
                </div>
            </div>
        );
    }
});

export default Home;
