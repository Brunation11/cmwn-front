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
    ],
    HEADINGS: {
        WORLD_HELP: (
            <span>
                The World needs help and we believe it is the kids of today who are going to be the ones to
                save it!
            </span>),
        SHINE: 'It\'s Time to Shine',
        PARTNERS: 'Our Partners'
    },
    PARAGRAPHS: [
        (<span>
            At <strong>Change My World Now</strong>,
            our team is committed to giving this next generation everything they need to take charge of their
            world and to become compassionate, responsible stewards of the future they are creating. With
            safety and parents in mind, we have built a place where kids, ages 6-14, can discover the world
            around them and take action through our amazing games and content.
        </span>)
    ],
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
        History.replace('/home');
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

    render() {
        return (
            <div id="home" className="home">
                <Modal id="video-modal"
                       show={this.state.viewOpen} onHide={this.setState.bind(this, {viewOpen: false})}>
                    <Modal.Body>
                        <iframe id="viddler-b9cd1cb6" src={'//www.viddler.com/embed/b9cd1cb6/?f=1&' +
                            'autoplay=1&player=simple&secret=54225444&make_responsive=0'}
                                width="100%" height="300" frameBorder="0" scrolling="no" allowFullScreen="1">
                        </iframe>
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
                        <div className="content-group centered sweater">
                            <div>
                                <h2>{COPY.SLIDES[0].HEADING}</h2>
                                <Button className="purple" id="video-btn"
                                        onClick={this.openViewModal.bind(this)}>
                                    {COPY.BUTTONS.WATCH}
                                </Button>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[1]}/>
                        <div className="content-group centered sweater">
                            <h2>{COPY.SLIDES[1].HEADING}</h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <img className="bg" src={SOURCES.SLIDEBG[2]}/>
                        <div className="content-group centered sweater">
                            <h2>{COPY.SLIDES[2].HEADING}</h2>
                        </div>
                    </CarouselItem>
                </Carousel>
                <div id="layout-sweater" className="sweater">
                    <Layout openModal={this.openModal.bind(this)}/>
                </div>
            </div>
        );
    }
}


/* istanbul ignore next */
mapStateToProps = state => {
    var currentUser = {};
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    return {
        currentUser
    };
};

ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;
