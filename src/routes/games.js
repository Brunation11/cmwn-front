import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';
import {connect} from 'react-redux';

import Detector from 'components/browser_detector';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import GLOBALS from 'components/globals';
import GenerateDataSource from 'components/datasource';
import History from 'components/history';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/users/profile.scss';

const PAGE_UNIQUE_IDENTIFIER = 'games';

var mapStateToProps;
var Page;

const GAME_WRAPPER = GenerateDataSource('games', 'games-list');

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Take Action'
};
const PLAY = 'Play Now!';
const COMING_SOON = 'Coming Soon!';

const BROWSER_NOT_SUPPORTED = (
    <span>
        <p>For the best viewing experience we reccomend the desktop version in Chrome</p>
        <p>If you don't have chrome,{' '}
            <a href="https://www.google.com/chrome/browser/desktop/index.html"
                target="_blank">download it for free here</a>.
        </p>
    </span>);

export var dataTransform = function (data) {
    var array = data;
    var currentIndex;
    var temporaryValue;
    var randomIndex;
    if (array == null) {
        array = [];
    } else if (!_.isArray(array)) {
        return [];
    }
    currentIndex = array.length;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return _.filter(array, v => !v.coming_soon).concat(_.filter(array, v => v.coming_soon));
};

export class GamesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.defaults({
            gameOn: false,
            gameId: -1
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {});
    }

    showModal(gameUrl) {
        var urlParts;
        if (Detector.isMobileOrTablet() || Detector.isPortrait()) {
            urlParts = gameUrl.split('/');
            urlParts.pop(); //discard index.html
            History.replace(`/game/${_.last(urlParts)}`);
        }
        this.setState({gameOn: true, gameUrl});
    }

    hideModal() {
        this.setState({gameOn: false});
        this.refs.gameRef.dispatchPlatformEvent('quit');
    }

    renderGame() {
        if (!window.navigator.standalone && (Detector.isMobileOrTablet() || Detector.isIe9() ||
            Detector.isIe10() || Detector.isIe11() || Detector.isFirefox() || Detector.isEdge())) {
            return (
                <div>
                    {BROWSER_NOT_SUPPORTED}
                    <p><a onClick={this.setState.bind(this, {gameOn: false})} >(close)</a></p>
                </div>
            );
        }
        return (
            <div>
                <Game ref="gameRef" isTeacher={!this.state.isStudent} url={this.state.gameUrl}
                    onExit={this.setState.bind(this, {gameOn: false})}/>
                    <a onClick={this.hideModal.bind(this)} className="modal-close">(close)</a>
            </div>
        );
    }

    renderFlip(item) {
        var onClick;
        var playText;
        if (item.coming_soon) {
            onClick = _.noop;
            playText = COMING_SOON;
        } else {
            onClick = this.showModal.bind(this, GLOBALS.GAME_URL + item.game_id + '/index.html');
            playText = PLAY;
        }
        return (
            <div className="flip fill" key={Shortid.generate()}>
                <a onClick={onClick.bind(this)} >
                    <div className="item">
                        <span className="overlay">
                            <span className="heading">{item.title}</span>
                            <span className="text">{item.description}</span>
                            <span className="play">{playText}</span>
                        </span>
                        <div className={ClassNames('coming-soon', { hidden: !item.coming_soon})} />
                        <object data={GLOBALS.GAME_URL + item.game_id + '/thumb.jpg'} type="image/png" >
                            <img src={FlipBgDefault}></img>
                        </object>
                    </div>
                </a>
            </div>
        );
    }

    renderGameList() {
        return (
           <GAME_WRAPPER transform={dataTransform}>
               <FlipBoard
                   renderFlip={this.renderFlip.bind(this)}
                   header={HEADINGS.ARCADE}
               />
           </GAME_WRAPPER>
        );
    }

    render() {
        return (
           <Layout className="games">
               {this.renderGameList()}
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

Page = connect(mapStateToProps)(GamesPage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
