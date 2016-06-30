import React from 'react';
import {Link} from 'react-router';
import {Carousel, CarouselItem, Button, Modal} from 'react-bootstrap';

import Store from 'components/store';
import Layout from 'layouts/home';
import Header from 'components/header';

import 'routes/home.scss';
import LOGO_URL from 'media/header-logo.png';
import LOGO_HEADER from 'media/header-header.png';
import SLIDE_A_BG_URL from 'media/home/green_background.png';
import SLIDE_B_BG_URL from 'media/home/purple_background.png';
import SLIDE_C_BG_URL from 'media/home/blue_background.png';

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
            HEADING: (
                <span>
                    Change my world now is the kids' social activation platform for the
                        <span className="em"> now </span>
                    generation
                </span>),
            /*I don't know that i love this convention for copy with arbitrary styling. It's clean but
              doesn't allow for programmatic transformation of text by the js below*/
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
    ]
};

const SOURCES = {
    LOGO: '',
    SLIDEBG: [
        SLIDE_A_BG_URL,
        SLIDE_B_BG_URL,
        SLIDE_C_BG_URL
    ],
    SHINE: '',
};

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            viewOpen: false,
            workOpen: false,
            contactOpen: false
        };
    }

    openViewModal() {
        this.setState({viewOpen: true});
    }

    openModal(id) {
        var state;

        state = {};
        state[id + 'Open'] = true;
        this.setState(state);
    }

    closeWork() {
        this.setState({ workOpen: false });
    }

    closeContact() {
        this.setState({ contactOpen: false });
    }

    render() {
        var logoLink = Store.getState().currentUser.user_id ? '/profile' : '/';
        return (
            <div id="home" className="home">
                <Modal show={this.state.viewOpen} onHide={this.setState.bind(this, {viewOpen: false})}>
                    <Modal.Body>
                        <iframe id="viddler-b9cd1cb6" src={'//www.viddler.com/embed/b9cd1cb6/?f=1&' +
                            'autoplay=1&player=simple&secret=54225444&make_responsive=0'}
                            width="100%" height="300" frameBorder="0" scrolling="no" allowFullScreen="1">
                        </iframe>
                    </Modal.Body>
                </Modal>
                <div className="global-header">
                    <div className="logo" ><Link to={logoLink} ><img alt="Change My World Now"
                        src={LOGO_URL} />Change My World Now</Link>
                    </div>
                    <div className="header-logo"><Link to={logoLink} ><img alt="Change My World Now"
                        src={LOGO_HEADER} /><span className="read">Change My World Now</span></Link>
                    </div>
                    <Header workOpen={this.state.workOpen} contactOpen={this.state.contactOpen}
                        closeWork={this.closeWork.bind(this)} closeContact={this.closeContact.bind(this)} />
                </div>
                <Carousel>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[0]} />
                        <div className="content-group centered sweater">
                            <div>
                                <h2>{COPY.SLIDES[0].HEADING}</h2>
                                <Button className="purple" onClick={this.openViewModal.bind(this)}>
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
                    <Layout openModal={this.openModal.bind(this)} />
                </div>
            </div>
        );
    }
}

export default Home;
