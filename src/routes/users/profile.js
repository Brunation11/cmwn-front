import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';
import {Panel, Modal} from 'react-bootstrap';
import QueryString from 'query-string';
import { connect } from 'react-redux';
import Moment from 'moment';

import Detector from 'components/browser_detector';
import ProfileImage from 'components/profile_image';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import Flipcase from 'components/flipcase';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
import History from 'components/history';
import GenerateDataSource from 'components/datasource';
import InfinitePaginator from 'components/infinite_paginator';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/users/profile.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'profile';
const GAME_COMPONENT_IDENTIFIER = 'games';

const GAME_WRAPPER = GenerateDataSource(GAME_COMPONENT_IDENTIFIER, PAGE_UNIQUE_IDENTIFIER);
const FLIP_SOURCE = GenerateDataSource('user_flip', PAGE_UNIQUE_IDENTIFIER);

const TITLES = {
    'aqua-lunch-man': '364c9a2dcd31232af6ee96514b7e8c8b.gif',
    'be-bright': 'e2426e0504ee73d6dc45c689f5d5f323.gif',
    'drought-out': 'a93c9f72b0df38ff63a6d0b686231bf6.gif',
    'happy-fish-face': 'f64606d786cb75e0eff7ca5ea5706abf.gif',
    'safety-first': '87ee5b0898c7e736e27353adf888fe4d.gif',
    'vr-world': '69faa25178b47e20275d19a63c5ff255.gif',
    'litter-bug': 'f55a5a39ada3b6b5e88f14298e631725.gif',
    'meerkat-mania': '47605ffc74272d540f2aaf083e1748fb.gif',
    'polar-bear': 'fb390fecbf002b31bada0644f66fdb9a.gif',
    'printmaster': '01a37a9e8707c8cdcc77afe8e611ce47.gif',
    'sea-turtle': '88929f4f060b7573c9137d4a67c2f049.gif',
    'tag-it': '9edd1259b96b2d676a88c83047af3656.gif',
    'twirl-n-swirl': 'dcd11a5f09726c4b0a91586b530c8264.gif',
    'fire': '6b2eab034602dc55d7c32312499bbc71.gif',
    'monarch': 'aca58f6b79a7ef1331a5f1f88a26c89b.gif',
    'waterdrop': '51861f8a31c9d899d73b38995625ed46.gif',
    'twirling-tower': '3890d968d8295e472006d0e8d0787f4a.gif',
    'salad-rain': '0a4edeec009c5ac56b1e586014cf002d.gif',
    'reef-builder': '19ff5314ce51ea7f4a059f0c07ac4142.gif',
    'pedal-pusher': '5e0eab9f9a6b70fc47b7586172f20c09.gif',
    'bloom-boom': 'd0341487768a960b6d255a3b25d2bf12.gif',
    'all-about-you': '14f629c77736290adc41531d72a6cc54.gif',
    'animal-id': '1d30b3302aad1608ad76c4029a4c2d5a.gif',
    'carbon-catcher': 'ab894b9d48a225ffdace7215003dd228.gif',
    'skribble': '10b58a3fbacaa46203faf65a02f8fbbc.gif',
    'turtle-hurdle': '1cf1a4952107ce19e6b8675643a17c5d.gif'
};

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Activities',
    TROPHYCASE: 'Trophycase'
};

const PLAY = 'Play Now!';
const COMING_SOON = 'Coming Soon!';
const DESKTOP_ONLY = 'Log on with a Desktop computer to play!';
const CLASSES = 'Classes';

const BROWSER_NOT_SUPPORTED = (
    <span>
        <p>For the best viewing experience we recommend the desktop version in Chrome</p>
        <p>If you don't have chrome,{' '}
            <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">
                download it for free here
            </a>.
        </p>
    </span>);

const PASS_UPDATED = '<p>You have successfully updated your password.' +
    '<br />Be sure to remember for next time!</p>';

export var dataTransform = function (data) {
    return data;
//    var array = data;
//    var currentIndex;
//    var temporaryValue;
//    var randomIndex;
//    if (array == null) {
//        array = [];
//    } else if (!_.isArray(array)) {
//        return [];
//    }
//    currentIndex = array.length;
//     // While there remain elements to shuffle...
//    while (0 !== currentIndex) {
//        // Pick a remaining element...
//        randomIndex = Math.floor(Math.random() * currentIndex);
//        currentIndex -= 1;
//        // And swap it with the current element.
//        temporaryValue = array[currentIndex];
//        array[currentIndex] = array[randomIndex];
//        array[randomIndex] = temporaryValue;
//    }
//    return _.filter(array, v => !v.coming_soon).concat(_.filter(array, v => v.coming_soon));
};

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.defaults({
            gameOn: false,
            gameId: -1
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {},
        {classes: {data: []}});
    }

    componentDidMount() {
        this.resolveRole(this.props);
        if (QueryString.parse(window.location.search).message === 'updated') {
            Toast.success(PASS_UPDATED);
        }

        if (this.props.data) {
            this.setState(this.props.data);
        }
    }

    componentWillReceiveProps(nextProps) {
        var nextState = nextProps.data;
        this.resolveRole(nextProps);
        this.setState(nextState);
    }

    resolveRole(props) {
        var newState = {};
        // remember we actually want current user here, not the user whose
        // profile we are looking at
        if (props.currentUser && props.currentUser.type &&
            props.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    }

    showModal(gameUrl) {
        var urlParts = gameUrl.split('/');
        urlParts.pop(); // discard index.html
        if (Detector.isMobileOrTablet() || Detector.isPortrait()) {
            History.push(`/game/${_.last(urlParts)}`);
        }
        this.setState({
            gameOn: true,
            gameUrl,
            game: _.last(urlParts),
        });
    }

    hideModal() {
        this.setState({gameOn: false});
        this.refs.gameRef.dispatchPlatformEvent('quit');
    }

    renderGame() {
        if (!window.navigator.standalone && (Detector.isMobileOrTablet() || Detector.isIe10())) {
            return (
                <div>
                    {BROWSER_NOT_SUPPORTED}
                    <p><a onClick={this.setState.bind(this, {gameOn: false})} >(close)</a></p>
                </div>
            );
        }
        return (
            <div className="modal-game">
                <Game
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    onExit={this.setState.bind(this, {gameOn: false})}
                    game={this.state.game}
                    currentUser={this.props.currentUser}
                />
                <a id="close-modal" onClick={this.hideModal.bind(this)} className="modal-close">(close)</a>
            </div>
        );
    }

    renderFlip(item) {
        var onClick;
        var playText;
        var meta = item.meta || {};

        if (item.coming_soon) {
            onClick = _.noop;
            playText = COMING_SOON;
        } else if (meta.desktop && Detector.isMobileOrTablet()) {
            onClick = _.noop;
            playText = DESKTOP_ONLY;
        } else {
            onClick = this.showModal.bind(this, `${GLOBALS.GAME_URL}${item.game_id}/index.html`);
            playText = PLAY;
        }
        return (
            <div className="flip fill" id={item.game_id} key={Shortid.generate()}>
                <a onClick={onClick.bind(this)} >
                    <div className="item">
                        <span className="overlay">
                            <span className="heading">{item.title}</span>
                            <span className="text">{item.description}</span>
                            <span className="play">{playText}</span>
                        </span>
                        <div className={ClassNames('coming-soon', { hidden: !item.coming_soon})} />
                        <div className={ClassNames('desktop-only', { hidden: !meta.desktop})} />
                        <object data={`${GLOBALS.MEDIA_URL}${TITLES[item.game_id]}`} type="image/gif" >
                            <img src={FlipBgDefault}></img>
                        </object>
                    </div>
                </a>
            </div>
        );
    }

    renderGameList() {
        if (this.state._links == null || this.props.currentUser.user_id !== this.state.user_id) {
            return null;
        }
        return (
               <GAME_WRAPPER transform={dataTransform}>
                   <InfinitePaginator
                       state={this.props.state}
                       componentIdentifier={GAME_COMPONENT_IDENTIFIER}
                       pageIdentifier={PAGE_UNIQUE_IDENTIFIER}
                       hasMore={this.props.hasMore}
                   >
                       <FlipBoard
                           renderFlip={this.renderFlip.bind(this)}
                           header={HEADINGS.ARCADE}
                           id="game-flip-board"
                       />
                   </InfinitePaginator>
               </GAME_WRAPPER>
        );
    }

    renderClassList() {
        if (!this.state || !this.state._embedded || !this.state._embedded.group_class) {
            return null;
        }
        return (
            <p>
                <strong>{CLASSES} </strong>:
                {_.map(this.state._embedded.group_class, item => item.title).join(', ')}
            </p>
        );
    }

    renderUserProfile() {
        var ISODate = (new Date(this.state.birthdate)).toISOString();
        if (this.state.friend_status === 'FRIEND') {
            return (
                <div>
                    <Panel header={this.state.username + '\'s ' + HEADINGS.ACTION} className="standard">
                        <div className="left">
                            <div className="frame">
                                <ProfileImage
                                    data={this.props.data}
                                    currentUser={this.props.currentUser}
                                    link-below={true}
                                 />
                            </div>
                        </div>
                        <div className="right">
                            <div className="user-metadata">
                                <p>Username:</p>
                                <p className="standard field">{this.state.username}</p>
                                <p>First Name:</p>
                                <p className="standard field">{this.state.first_name}</p>
                                <p>Last Name:</p>
                                <p className="standard field">{this.state.last_name}</p>
                                <p>Birthday:</p>
                                <p className="standard field">{Moment(ISODate).format('MM-DD-YYYY')}</p>
                            </div>
                        </div>
                    </Panel>
                    <Panel
                        header={HEADINGS.TROPHYCASE}
                        className={ClassNames('standard', {
                            hidden: !this.state.isStudent
                        })}
                    >
                        <FLIP_SOURCE>
                           <Flipcase
                                type="trophycase"
                                header={true}
                                render="earned"
                            />
                        </FLIP_SOURCE>
                    </Panel>
                </div>
            );
        }
        return (
            <div>
                <Panel header={this.state.username + '\'s ' + HEADINGS.ACTION} className="standard">
                    <div className="frame non-friend">
                        <ProfileImage
                            data={this.props.data}
                            currentUser={this.props.currentUser}
                            link-below={true}
                        />
                    </div>
                </Panel>
                <Panel
                    header={HEADINGS.TROPHYCASE}
                    className={ClassNames('standard', {
                        hidden: !this.state.isStudent
                    })}
                >
                    <FLIP_SOURCE>
                       <Flipcase
                            type="trophycase"
                            header={true}
                            render="earned"
                        />
                    </FLIP_SOURCE>
                </Panel>
            </div>
        );
    }

    renderCurrentUserProfile() {
        return (
            <div>
                <Modal
                    className="full-width game-modal"
                    show={this.state.gameOn}
                    onHide={this.hideModal.bind(this)}
                    keyboard={false}
                    backdrop="static"
                    id="game-modal"
                >
                    <Modal.Body>
                        {this.renderGame()}
                    </Modal.Body>
                </Modal>
                <Panel
                    header={HEADINGS.TROPHYCASE}
                    className={ClassNames('standard', {
                        hidden: !this.state.isStudent
                    })}
                >
                    <FLIP_SOURCE>
                       <Flipcase
                            type="trophycase"
                            header={true}
                            render="earned"
                        />
                    </FLIP_SOURCE>
                </Panel>
                {this.renderGameList()}
            </div>
        );
    }

    render() {
        var profile;
        if (this.state.user_id == null || this.props.currentUser.user_id == null) {
            return null;
        }
        profile = this.state.user_id === this.props.currentUser.user_id ?
        this.renderCurrentUserProfile : this.renderUserProfile;
        return (
           <Layout
               currentUser={this.props.currentUser}
               className={PAGE_UNIQUE_IDENTIFIER}
               navMenuId="navMenu"
           >
               {profile.apply(this)}
           </Layout>
        );
    }
}

Profile.defaultProps = {
    state: {}
};

mapStateToProps = state => {
    var componentKey = GAME_COMPONENT_IDENTIFIER + '-' + PAGE_UNIQUE_IDENTIFIER;
    var data = {};
    var loading = true;
    var currentUser = {};
    var hasMore = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    if (state.components && state.components[componentKey] && state.components[componentKey].has_more) {
        hasMore = state.components[componentKey].has_more === true;
    }
    return {
        state,
        hasMore,
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Profile);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

