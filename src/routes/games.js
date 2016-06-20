import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import Detector from 'components/browser_detector';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import GLOBALS from 'components/globals';
import GenerateDataSource from 'components/datasource';
import History from 'components/history';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/users/profile.scss';

const GameWrapper = GenerateDataSource('games', 'games-list');

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Take Action'
};
const PLAY = 'Play Now!';
const COMING_SOON = 'Coming Soon!';

const BROWSER_NOT_SUPPORTED = <span><p>For the best viewing experience we reccomend the desktop version in Chrome</p><p>If you don't have chrome, <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">download it for free here</a>.</p></span>;

var Profile = React.createClass({
    getInitialState: function () {
        var state = _.defaults({
            gameOn: false,
            gameId: -1
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {});
        return state;
    },
    showModal: function (gameUrl) {
        var urlParts;
        if (Detector.isMobileOrTablet() || Detector.isPortrait()) {
            urlParts = gameUrl.split('/');
            urlParts.pop(); //discard index.html
            History.replace(`/game/${_.last(urlParts)}`);
        }
        this.setState({gameOn: true, gameUrl});
    },
    hideModal: function () {
        this.setState({gameOn: false});
        this.refs.gameRef.dispatchPlatformEvent('quit');
    },
    renderGame: function () {
        if (!window.navigator.standalone && (Detector.isMobileOrTablet() || Detector.isIe9() || Detector.isIe10() || Detector.isIe11() || Detector.isFirefox() || Detector.isEdge())) {
            return (
                <div>
                    {BROWSER_NOT_SUPPORTED}
                    <p><a onClick={() => this.setState({gameOn: false})} >(close)</a></p>
                </div>
            );
        }
        return (
            <div>
                <Game ref="gameRef" isTeacher={!this.state.isStudent} url={this.state.gameUrl} onExit={() => this.setState({gameOn: false})}/>
                    <a onClick={this.hideModal} className="modal-close">(close)</a>
            </div>
        );
    },
    renderFlip: function (item){
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
                <a onClick={onClick} >
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
    },
    renderGameList: function () {
        return (
           <GameWrapper transform={data => {
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
           }}>
               <FlipBoard
                   renderFlip={this.renderFlip}
                   header={HEADINGS.ARCADE}
               />
           </GameWrapper>
        );
    },
    render: function () {
        return (
           <Layout className="games">
               {this.renderGameList()}
           </Layout>
        );
    }
});

const mapStateToProps = state => {
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

var Page = connect(mapStateToProps)(Profile);
export default Page;

