import React from 'react';
import { Carousel, CarouselItem, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/home';
import Header from 'components/header';
import History from 'components/history';

import 'routes/home.scss';
import LOGO_URL from 'media/header-logo.png';
import LOGO_HEADER from 'media/header-header.png';
import SLIDE_A_BG_URL from 'media/home/green_background.png';
import SLIDE_B_BG_URL from 'media/home/purple_background.png';
import SLIDE_C_BG_URL from 'media/home/blue_background.png';

var ConnectedHome;
var mapStateToProps;

export const COPY = {
    BUTTONS: {
        WATCH: 'Watch the video',
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

export const SOURCES = {
    LOGO: '',
    SLIDEBG: [
        SLIDE_A_BG_URL,
        SLIDE_B_BG_URL,
        SLIDE_C_BG_URL
    ],
    SHINE: '',
};

export class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            viewOpen: false,
            workOpen: false,
            contactOpen: false
        };
    }

    componentDidMount() {
        //History.replace('/home');
        //Store.
    }

    logoLink() {
        if (this.props.currentUser.user_id) {
            History.replace('/profile');
        } else {
            History.replace('/home');
        }
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

    /* eslint-disable max-len */
    render() {
        return (
            <div id="home" className="home">
                <Modal id="video-modal"
                       show={this.state.viewOpen} onHide={this.setState.bind(this, {viewOpen: false})}>
                    <Modal.Body>
                        <iframe src="https://player.vimeo.com/video/135112766?autoplay=true&width=568" width="568" height="319.5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        <p><a href="https://vimeo.com/135112766">WHY WE DO</a> from <a href="https://vimeo.com/user42522076">ChangeMyWorldNow</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
                    </Modal.Body>
                </Modal>
                <div className="global-header">
                    <div className="logo">
                        <span className="logo-button" onClick={this.logoLink.bind(this)}>
                            <img alt="Change My World Now" src={LOGO_URL}/>
                        </span>
                    </div>
                    <div className="header-logo">
                        <span className="logo-button" onClick={this.logoLink.bind(this)}>
                            <img alt="Change My World Now" src={LOGO_HEADER}/>
                        </span>
                    </div>
                    <Header
                        workOpen={this.state.workOpen}
                        contactOpen={this.state.contactOpen}
                        closeWork={this.setState.bind(this, { workOpen: false })}
                        closeContact={this.setState.bind(this, { contactOpen: false })}
                        currentUser={this.props.currentUser}
                    />
                </div>
                <Carousel>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[0]}/>
                        <div className="content-group centered">
                            <section>
                                <h2>{COPY.SLIDES[0].HEADING}</h2>
                                <Button className="purple" id="video-btn"
                                        onClick={this.openViewModal.bind(this)}>
                                    {COPY.BUTTONS.WATCH}
                                </Button>
                            </section>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[1]}/>
                        <section className="content-group centered">
                            <h2>{COPY.SLIDES[1].HEADING}</h2>
                        </section>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[2]}/>
                        <section className="content-group centered">
                            <h2>{COPY.SLIDES[2].HEADING}</h2>
                        </section>
                    </CarouselItem>
                </Carousel>
                <div id="layout-sweater" className="sweater">
                    <Layout openModal={this.openModal.bind(this)}/>
                </div>
            </div>
        );
    }
}

/* eslint-enable max-len */


/* istanbul ignore next */
mapStateToProps = state => {
    var currentUser = {};
    var userId;
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    if (state.current_user && state.current_user.user_id) {
        userId = state.current_user.user_id;
    }
    return {
        currentUser,
        userId
    };
};

ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;
