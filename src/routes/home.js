import React from 'react';
import _ from 'lodash';
import {Carousel, CarouselItem, Button, Modal}

import 'routes/home.scss';

const COPY = {
    BUTTONS: {
        WORK: '',
        CONTACT: '',
        LOGIN: '',
        SIGNUP: '',
        WATCH: ''
    }
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
        SIGNUP: ''
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

var Home = React.createClass(function () {
    render: function () {
        return (
            <div className="home">
                <Header />
                <Layout />
            </div>
        );
    }
});

var Header = React.createClass(function () {
    displayWorkModal: function () {},
    displayContactModal: function () {},
    loginAlert: function () {},
    signupAlert: function () {},
    render: function () {
        return (
            <div>
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

var Layout = React.createClass(function () {
    openViewModal: function () {},
    render: function () {
        return (
            <div className="layout">
                <div className="content">
                    <Carousel>
                        <CarouelItem style={
                            backgroundImage: `url(${SOURCES.SLIDEBG[0]})`
                        }>
                            <p>
                                {COPY.SLIDES[0].TEXT}
                            </p>
                            <Button className="purple" onClick={this.openViewModal}>
                                {COPY.BUTTONS.WATCH}
                            </Button>
                        </CarouselItem>
                        <CarouelItem style={
                            backgroundImage: `url(${SOURCES.SLIDEBG[1]})`
                        }>
                            <p>
                                {COPY.SLIDES[1].TEXT}
                            </p>
                        </CarouselItem>
                        <CarouelItem style={
                            backgroundImage: `url(${SOURCES.SLIDEBG[2]})`
                        }>
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
