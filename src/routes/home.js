import React from 'react';
import _ from 'lodash';
import {Carousel, CarouselItem, Button, Modal} from 'react-bootstrap';

import 'routes/home.scss';

const COPY = {
    BUTTONS: {
        WORK: 'Work with Us',
        CONTACT: 'Contact Us',
        LOGIN: '',
        SIGNUP: '',
        WATCH: ''
    },
    SLIDES: [
        {
            HEADING: '',
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: '',
            TEXT: '',
            ALT: ''
        },
        {
            HEADING: '',
            TEXT: '',
            ALT: ''
        },
    ],
    HEADINGS: {
        SHINE: '',
        PARTNERS: ''
    },
    PARAGRAPHS: [
        '',
        '',
        '',
        ''
    ],
    ALERTS: {
        LOGIN: '',
        SIGNUP: ''
    },
    MODALS: {
        WORK: '',
        CONTACT: ''
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
        this.setState({viewOpen: true});
    },
    signupAlert: function () {
        this.setState({viewOpen: true});
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
                        {COPY.MODALS.VIEW}
                    </Modal>
                    <Carousel>
                        <CarouselItem style={{
                            backgroundImage: `url(${SOURCES.SLIDEBG[0]})`
                        }}>
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
                    <h2>{COPY.SHINE}</h2>
                    <p>{_.map(COPY.PARAGRAPHS, _.identity)}</p>
                    <h2>{COPY.PARTNERS}</h2>
                    <p>{SOURCES.PARTNERS}</p>
                </div>
            </div>
        );
    }
});

export default Home;
