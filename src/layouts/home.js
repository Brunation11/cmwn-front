import React from 'react';
import _ from 'lodash';
import Shortid from 'shortid';

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

export const SOURCES = {
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

export const COPY = {
    BUTTONS: {
        WORK: 'Work with Us',
        CONTACT: 'Contact Us',
        TERMS: 'Terms & Conditions',
    },
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
    ]
};

class Layout extends React.Component {
    displayWorkModal() {
        this.props.openModal('work');
    }

    displayContactModal() {
        this.props.openModal('contact');
    }

    render() {
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
                            {_.map(SOURCES.PARTNERS, url => <div className="cell" style={{backgroundImage:
                                `url(${url})`}} key={Shortid.generate()}></div>)}
                        </div>
                    </div>
                    <footer className="links">
                        <a href="#" id="work-modal-link" onClick={this.displayWorkModal.bind(this)}>
                            {COPY.BUTTONS.WORK}
                        </a>
                        <a href="#" id="contact-modal-link" onClick={this.displayContactModal.bind(this)}>
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
}

export default Layout;
