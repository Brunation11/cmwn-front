import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Panel, Modal} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import ProfileImage from 'components/profile_image';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import Authorization from 'components/authorization';
import EventManager from 'components/event_manager';
import Fetcher from 'components/fetcher';
import EditLink from 'components/edit_link';
import Trophycase from 'components/trophycase';
import GLOBALS from 'components/globals';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/students/profile.scss';

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Take Action'
};
const PLAY = 'Play Now!';

var Page = React.createClass({
    getInitialState: function () {
        var self = this;
        self.uuid = self.props.params.id || Authorization.currentUser.uuid;
        self.url = GLOBALS.API_URL + 'users/' + self.uuid + '?include=roles,groups,images';
        self.currentLoc = document.location.pathname;
        if (self.uuid == null || self.uuid.toLowerCase() === 'null') {
            //race condition edge case where the profile has loaded before the auth module
            Authorization.userIsLoaded.then(() => {
                self.uuid = self.props.params.id || Authorization.currentUser.uuid;
                self.url = GLOBALS.API_URL + 'users/' + self.uuid + '?include=roles,groups,images';
                self.forceUpdate();
            });
        }
        return {};
    },
    componentWillReceiveProps: function () {
        if (self.currentLoc !== document.location.pathname) {
            document.location.reload();
        }
    },
    render: function () {
        if (this.uuid == null || this.uuid.toLowerCase() === 'null') {
            return null;
        }
        return (
            <Fetcher url={this.url}>
                <Profile />
            </Fetcher>
        );
    }
});

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
            this.forceUpdate();
        });
        this.resolveRole();
    },
    componentWillReceiveProps: function () {
        this.resolveRole();
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
        this.setState({gameOn: true, gameUrl});
    },
    hideModal: function () {
        this.setState({gameOn: false});
    },
    renderFlip: function (item){
        return (
            <div className="flip fill">
                <a onClick={this.showModal.bind(this, 'https://games-dev.changemyworldnow.com/' + item.uuid + '/index.html')} >
                    <div className="item">
                        <span className="overlay">
                            <span className="heading">{item.title}</span>
                            <span className="text">{item.description}</span>
                            <span className="play">{PLAY}</span>
                        </span>
                        <object data={'https://games.changemyworldnow.com/' + item.uuid + '/thumb.jpg'} type="image/png" >
                            <img src={FlipBgDefault}></img>
                        </object>
                    </div>
                </a>
            </div>
        );
    },
    render: function () {
        return (
           <Layout className="profile">
                <Modal className="full-width" show={this.state.gameOn} onHide={this.hideModal} keyboard={false} backdrop="static">
                    <Modal.Body>
                        <Game url={this.state.gameUrl} onExit={() => this.setState({gameOn: false})}/>
                        <a onClick={() => this.setState({gameOn: false})} className="modal-close">(close)</a>
                    </Modal.Body>
                </Modal>
               <Trophycase className={ClassNames({hidden: !this.state.isStudent})} data={this.state} />
               <Panel header={
                   ((this.state.uuid === Authorization.currentUser.uuid) ? 'My ' : this.state.username + '\'s ') + HEADINGS.ACTION
               } className={ClassNames('standard', {hidden: !this.state.isStudent && this.state.uuid === Authorization.currentUser.uuid})}>
               <div className="infopanel">
                     <EditLink base="/profile" uuid={this.state.uuid} canUpdate={this.state.can_update} />
                     <ProfileImage className={ClassNames({hidden: this.state.uuid === Authorization.currentUser.uuid})} uuid={this.state.uuid} link-below={true}/>
                     <div className="info">
                        <p><strong>Classes</strong>: {_.map(this.state.groups.data, item => item.title).join(', ')}</p>
                     </div>
                 </div>
               </Panel>
               <Fetcher className={ClassNames({hidden: this.state.uuid !== Authorization.currentUser.uuid})} url={GLOBALS.API_URL + 'games'} >
                   <FlipBoard
                       renderFlip={this.renderFlip}
                       header={HEADINGS.ARCADE}
                   />
               </Fetcher>
           </Layout>
        );
    }
});

export default Page;

