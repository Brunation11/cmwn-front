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
import Flag from 'components/flag';
import IB_IDS from 'components/ib_ids';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/users/profile.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'profile';

const GAME_WRAPPER = GenerateDataSource('games', PAGE_UNIQUE_IDENTIFIER);
const FLIP_SOURCE = GenerateDataSource('user_flip', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Activities'
};

const PLAY = 'Play Now!';
const COMING_SOON = 'Coming Soon!';
const DESKTOP_ONLY = 'Log on with a Desktop computer to play!';

const BROWSER_NOT_SUPPORTED = (
    <span>
        <p>For the best viewing experience we recommend the desktop version in Chrome</p>
        <p>If you don't have chrome,{' '}
            <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">
                download it for free here
            </a>.
        </p>
    </span>
);

const PASS_UPDATED = (
    <p>You have successfully updated your password.<br />Be sure to remember for next time!</p>
);

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
        this.resolveRole(nextProps);
        this.setState(nextProps.data);
    }

    resolveRole(props) {
        // remember we actually want current user here, not the user whose
        // profile we are looking at
        if (props.currentUser && props.currentUser.type &&
            props.currentUser.type !== 'CHILD') {
            this.setState({isStudent: false});
        } else {
            this.setState({isStudent: true});
        }
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
                        <object
                            data={`${GLOBALS.MEDIA_URL}${IB_IDS.GAME_TILES[item.game_id]}`}
                            type="image/gif"
                        >
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
               <FlipBoard
                   renderFlip={this.renderFlip.bind(this)}
                   header={HEADINGS.ARCADE}
                   id="game-flip-board"
               />
           </GAME_WRAPPER>
        );
    }

    renderUserMetaData() {
        var ISODate = (new Date(this.state.birthdate)).toISOString();

        if (this.state.friend_status !== 'FRIEND') return null;

        return (
            <div
                className={ClassNames(
                    'right',
                    'user-fields',
                    {
                        hidden: this.state.friend_status !== 'FRIEND'
                    }
                )}
            >
                <p className="label">Username:</p>
                <p className="standard field">{this.state.username}</p>
                <p className="label">First Name:</p>
                <p className="standard field">{this.state.first_name}</p>
                <p className="label">Last Name:</p>
                <p className="standard field">{this.state.last_name}</p>
                <p className="label">Birthday:</p>
                <p className="standard field">{Moment(ISODate).format('MM-DD-YYYY')}</p>
            </div>
        );
    }

    renderUserProfile() {
        return (
            <Layout
                currentUser={this.props.currentUser}
                className={ClassNames(
                    PAGE_UNIQUE_IDENTIFIER,
                    'user',
                    {
                        friends: this.state.friend_status === 'FRIEND',
                        student: this.state.type === 'CHILD'
                    }
                )}
                navMenuId="navMenu"
            >
                <Panel
                    header={`${this.state.username}'s Profile`}
                    className="standard user-profile"
                >
                    <div className="left profile-image-container">
                        <Flag
                            data={this.props.data}
                        >
                            <ProfileImage
                                data={this.props.data}
                                currentUser={this.props.currentUser}
                                link-below={true}
                            />
                        </Flag>
                    </div>
                    {this.renderUserMetaData()}
                </Panel>
                <FLIP_SOURCE>
                   <Flipcase
                        className={ClassNames(
                            {
                                hidden: this.state.type !== 'CHILD'
                            }
                        )}
                        type="trophycase"
                        header={true}
                        render="earned"
                        user={this.state.username}
                    />
                </FLIP_SOURCE>
            </Layout>
        );
    }

    renderCurrentUserProfile() {
        return (
            <Layout
                currentUser={this.props.currentUser}
                className={`${PAGE_UNIQUE_IDENTIFIER} current-user`}
                navMenuId="navMenu"
            >
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
                    <FLIP_SOURCE>
                        <Flipcase
                            className={ClassNames(
                                {
                                    hidden: !this.state.isStudent
                                }
                            )}
                            type="trophycase"
                            header={true}
                            render="earned"
                        />
                    </FLIP_SOURCE>
                    {this.renderGameList()}
                </div>
            </Layout>
        );
    }

    render() {
        if (this.state.user_id == null || this.props.currentUser.user_id == null) return null;

        if (this.state.user_id === this.props.currentUser.user_id) {
            return this.renderCurrentUserProfile();
        } else {
            return this.renderUserProfile();
        }
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Profile);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
