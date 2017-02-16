import React from 'react';
import _ from 'lodash';
import Slider from 'react-slick';

import GLOBALS from 'components/globals';

import './featured_games.scss';

const LABELS = {
    ABOUT: 'About this game',
    FLAG: 'Featured Games',
    LEFT: 'Left',
    RIGHT: 'Right'
};

const COMPONENT_UNIQUE_IDENTIFIER = 'featured-games';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }
    renderLeft(props) {
        return (
            <div className="left">
                <button {...props}><span>{'<'}</span></button>
            </div>
        );
    }
    renderRight(props) {
        return (
            <div className="right">
                <button {...props}><span>{'>'}</span></button>
            </div>
        );
    }
    renderSlides() {
        var slides;
        slides = _.map(this.props.data, i => {
            return (
                <figure className="slide effect-apollo" onClick={this.props.launchGame.bind(null, i.game_id)}>
                    <div className="slide-container">
                        <object
                            width="685"
                            height="218"
                            className="background"
                            data={`${GLOBALS.MEDIA_URL}titles/18-5/${i.game_id}.gif`}
                        >
                            <object
                                data={`${GLOBALS.MEDIA_URL}titles/18-5/${i.game_id}.png`}
                                width="685"
                                height="218"
                            >
                                <object
                                    data={`${GLOBALS.MEDIA_URL}titles/18-5/${i.game_id}.jpg`}
                                    width="685"
                                    height="218"
                                >
                                    <img
                                        src={`${GLOBALS.MEDIA_URL}titles/18-5/${i.game_id}.jpeg`}
                                        width="685"
                                        height="218"
                                    />
                                </object>
                            </object>
                        </object>
                    </div>
                    <figcaption className="labels">
                        <span className="about">{LABELS.ABOUT}</span>
                        <span>{i.description}</span>
                    </figcaption>
                </figure>
            );
        });
        return slides;
    }
    render() {
        if (this.props.data == null) return null;

        return (
            <div className={COMPONENT_UNIQUE_IDENTIFIER} >
                <div className="featured-flag"><span>{LABELS.FLAG}</span></div>
                <Slider
                    arrows={true}
                    infinite={true}
                    lazyLoad={true}
                    slidesToShow={1}
                    slidesToScroll={1}
                    prevArrow={this.renderLeft()}
                    nextArrow={this.renderRight()}
                >
                    {this.renderSlides()}
                </Slider>
                <div className="featured-nub"></div>
            </div>
        );
    }
}

Component.defaultProps = {
    launchGame: _.identity
};

Component.identifier = COMPONENT_UNIQUE_IDENTIFIER;
export default Component;

