import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';
import {Panel, Modal} from 'react-bootstrap';
import QueryString from 'query-string';

import Detector from 'components/browser_detector';
import ProfileImage from 'components/profile_image';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import Authorization from 'components/authorization';
import EventManager from 'components/event_manager';
import Fetcher from 'components/fetcher';
import EditLink from 'components/edit_link';
import Trophycase from 'components/trophycase';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
//import Util from 'components/util';
import History from 'components/history';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/users/profile.scss';

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Take Action'
};
const PLAY = 'Play Now!';
const COMING_SOON = 'Coming Soon!';

const BROWSER_NOT_SUPPORTED = <span><p>For the best viewing experience we reccomend the desktop version in Chrome</p><p>If you don't have chrome, <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">download it for free here</a>.</p></span>;
const PASS_UPDATED = 'You have successfully updated your password. Be sure to remeber it for next time!';

var Profile = React.createClass({
    getInitialState: function () {
        var state = _.defaults({
            gameOn: false,
            gameId: -1
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {},
        {groups: {data: []}});
        return state;
    },
    componentDidMount: function () {
        EventManager.listen('userChanged', () => {
            /** @TODO MPR, 12/21/15: Remove this conditional once CORE-146 and CORE-219 are done*/
            if (this.state.canupdate == null && this.state.can_update == null) {
                this.setState({'can_update': this.state.uuid === Authorization.currentUser.uuid});
            } else if (this.state.canupdate != null){
                this.setState({'can_update': this.state.canupdate});
            }
            this.resolveRole();
            this.forceUpdate();
        });
        this.resolveRole();
        if (QueryString.parse(location.search).message === 'updated') {
            Toast.success(PASS_UPDATED);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.loading === false && nextProps.data.user_id !== this.props.data.user_id) {
            this.setState(nextProps.data);
        }
    },
    resolveRole: function () {
        var newState = {};
        if (this.props.data == null) {
            return;
        }
        if (this.props.data.roles && ~this.props.data.roles.data.indexOf('Student')) {
            newState.isStudent = true;
        } else {
            newState.isStudent = false;
        }
        this.setState(newState);
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
        if (!window.navigator.standalone && (Detector.isMobileOrTablet() || Detector.isIe9() || Detector.isIe10() || Detector.isIe11())) {
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
        var onClick, playText;
        if (item.coming_soon) {
            onClick = _.noop;
            playText = COMING_SOON;
        } else {
            onClick = this.showModal.bind(this, GLOBALS.GAME_URL + item.uuid + '/index.html');
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
                        <object data={GLOBALS.GAME_URL + item.uuid + '/thumb.jpg'} type="image/png" >
                            <img src={FlipBgDefault}></img>
                        </object>
                    </div>
                </a>
            </div>
        );
    },
    renderGameList: function () {
        if (this.props.gameUrl == null) {
            return null;
        }
        return (
           <Fetcher className={ClassNames({hidden: this.state.uuid !== Authorization.currentUser.uuid})} url={this.props.gameUrl} transform={data => {
               var array = data.game;
               var currentIndex, temporaryValue, randomIndex;
               if (array == null) {
                   array = [];
               } else if (!_.isArray(array)) {
                   array = [].concat(array);
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
           </Fetcher>
        );
    },
    render: function () {
        return (
           <Layout className="profile">
                <Modal className="full-width" show={this.state.gameOn} onHide={this.hideModal} keyboard={false} backdrop="static">
                    <Modal.Body>
                        {this.renderGame()}
                    </Modal.Body>
                </Modal>
               <Trophycase className={ClassNames({hidden: !this.state.isStudent})} data={this.state} />
               <Panel header={
                   ((this.state.user_id === Authorization.currentUser.uuid) ? 'My ' : this.state.username + '\'s ') + HEADINGS.ACTION
               } className={ClassNames('standard', {hidden: !this.state.isStudent && this.state.uuid === Authorization.currentUser.uuid})}>
               <div className="infopanel">
                     <EditLink base="/profile" uuid={this.state.uuid} canUpdate={this.state.can_update} />
                     <ProfileImage className={ClassNames({hidden: this.state.uuid === Authorization.currentUser.uuid})} uuid={this.state.uuid} link-below={true}/>
                     <div className="info">
                        <p><strong>Classes</strong>: {_.map(this.state.groups.data, item => item.title).join(', ')}</p>
                     </div>
                 </div>
               </Panel>
               {this.renderGameList()}
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var gameUrl = null;
    var loading = true;
    if (state.page && state.page.data) {
        loading = state.page.loading;
        data = state.page.data;
        debugger;
        if (state.page.data._links && state.page.data._links.games) {
            gameUrl = state.page.data._links.games.href;
        }
    }
    return {
        data,
        loading,
        gameUrl
    };
};

var Page = connect(mapStateToProps)(Profile);
export default Page;

