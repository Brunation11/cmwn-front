import React from 'react';
import _ from 'lodash';
import {Carousel, CarouselItem, Button, Modal} from 'react-bootstrap';

import 'routes/home.scss';

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
            HEADING: <span>Change my world now is the kids' soical activation platform for the <span className="purple">now</span> generation</span>,
            /*I don't know that i love this convention for copy with arbitrary styling. It's clean but doesn't allow for programmatic transformation of text by the js below*/
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: '',
            TEXT: 'Be the hero of your own story',
            ALT: ''
        },
        {
            HEADING: '',
            TEXT: 'Start changing the world now!',
            ALT: ''
        },
    ],
    HEADINGS: {
        SHINE: 'It\'s Time to Shine',
        PARTNERS: 'Our Partners'
    },
    PARAGRAPHS: [
        'For Grown Ups Too!',
        'Welcome Adult Change-Makers! We\'re thrilled that you joined us here at ChangeMyWorldNow.com Whether you\'re assiting your child, student, grandchild, foster friend, or local scout troop, we are here to help you make a big difference in their lives...as well as your own.',
        'Use our teacher and parent friendly tabs to help you plan activites and find enlightening inspiration and instruction for you and your families',
        <span>Here's to all of us <em><b>Changing the world together!</b></em></span>
    ],
    ALERTS: {
        LOGIN: 'Thanks for your interest! We\'ll be launching very soon, and will keep you notified of updates!',
        SIGNUP: 'We would be happy to help you start the process. Give us a call at xxx for more details!'
    },
    MODALS: {
        WORK: 'We would be happy to help you start the process. Give us a call at REAL CONTACT INFO for more details!',

        CONTACT: 'REAL CONTACT INFO HERE'
    }
};

const SOURCES = {
    LOGO: '',
    SLIDEBG: [
        '',
        '',
        ''
    ],
    SHINE: '',
    PARTNERS: ''
};

var Home = React.createClass({
    render: function () {
        return (
            <div className="home">
                <Header />
                <Layout />
            </div>
        );
    }
});

var Header = React.createClass({
    getInitialState: function () {
        return {
            workOpen: false,
            contactOpen: false
        };
    },
    displayWorkModal: function () {
        this.setState({workOpen: true});
    },
    displayContactModal: function () {
        this.setState({contactOpen: true});
    },
    loginAlert: function () {
        /** @TODO MPR, 11/22/15: requires CORE-117*/
    },
    signupAlert: function () {
        /** @TODO MPR, 11/22/15: requires CORE-117*/
    },
    render: function () {
        return (
            <div>
                <Modal show={this.state.workOpen} onHide={() => this.setState({workOpen: false})}>
                    <Modal.Body>
                        {COPY.MODALS.WORK}
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.contactOpen} onHide={() => this.setState({contactOpen: false})}>
                    <Modal.Body>
                        {COPY.MODALS.CONTACT}
                    </Modal.Body>
                </Modal>
                <h1 className="fallback">Change My World Now</h1>
                <Button className="white" onClick={this.displayWorkModal}>
                    {COPY.BUTTONS.WORK}
                </Button>
                <Button className="white" onClick={this.displayContactModal}>
                    {COPY.BUTTONS.CONTACT}
                </Button>
                <img src={SOURCES.LOGO} alt='Change My World Now'/>
                <Button className="blue" onClick={this.loginAlert}>
                    {COPY.BUTTONS.LOGIN}
                </Button>
                <Button className="blue" onClick={this.signupAlert}>
                    {COPY.BUTTONS.SIGNUP}
                </Button>
            </div>
        );
    }
});

var Layout = React.createClass({
    getInitialState: function () {
        return {
            viewOpen: false
        };
    },
    openViewModal: function () {
        this.setState({viewOpen: true});
    },
    render: function () {
        return (
            <div className="layout">
                <div className="content">
                    <Modal show={this.state.viewOpen} onHide={() => this.setState({viewOpen: false})}>
                        <Modal.Body>
                            {COPY.MODALS.VIEW}
                        </Modal.Body>
                    </Modal>
                    <Carousel>
                        <CarouselItem style={{
                            backgroundImage: `url(${SOURCES.SLIDEBG[0]})`
                        }}>
                            <h2>{COPY.SLIDES[0].HEADING}</h2>
                            <p>
                                {COPY.SLIDES[0].TEXT}
                            </p>
                            <Button className="purple" onClick={this.openViewModal}>
                                {COPY.BUTTONS.WATCH}
                            </Button>
                        </CarouselItem>
                        <CarouselItem style={{
                            backgroundImage: `url(${SOURCES.SLIDEBG[1]})`
                        }}>
                            <p>
                                {COPY.SLIDES[1].TEXT}
                            </p>
                        </CarouselItem>
                        <CarouselItem style={{
                            backgroundImage: `url(${SOURCES.SLIDEBG[2]})`
                        }}>
                            <p>
                                {COPY.SLIDES[2].TEXT}
                            </p>
                        </CarouselItem>
                    </Carousel>
                    <h2>{COPY.HEADINGS.SHINE}</h2>
                    {_.map(COPY.PARAGRAPHS, text => <p>{text}</p>)}
                    <h2>{COPY.HEADINGS.PARTNERS}</h2>
                    <p>{SOURCES.PARTNERS}</p>
                </div>
            </div>
        );
    }
});

export default Home;
