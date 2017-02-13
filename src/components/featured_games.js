import React from 'react';
import _ from 'lodash';
import {Button} from 'react-bootstrap';
import Slider from 'react-slick';

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
    componentWillReceiveProps(nextProps) {
    }
    renderLeft(props) {
        return (
            <div className="left">
                <button {...props}>{'<'}</button>
            </div>
        );
    }
    renderRight(props) {
        return (
            <div className="right">
                <button {...props}>{'>'}</button>
            </div>
        );
    }
    renderSlides() {
        var slides;
        slides = _.map(this.props.data, i => {
            return (
                <div className="slide" onClick={this.props.launchGame.bind(null, i.game_id)}>
                    <img width="703" height="218" className="background" src={'https://media-staging.changemyworldnow.com/f/8254c3f834ced23d71fd1de6c0ae1aad.gif'} />
                    <img width="703" height="218" className="overlay"  src={'https://media-staging.changemyworldnow.com/f/8254c3f834ced23d71fd1de6c0ae1aad.gif'} />
                    <div className="labels">
                        <span>{LABELS.ABOUT}</span>
                        <span>{i.description}</span>
                    </div>
                </div>
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
            </div>
        );
    }
}

Component.defaultProps = {
    launchGame: _.identity
};

Component.identifier = COMPONENT_UNIQUE_IDENTIFIER;
export default Component;

