import React from 'react';
import _ from 'lodash';
import {Panel, Modal} from 'react-bootstrap';

import Layout from 'layouts/two_col';
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
        self.url = GLOBALS.API_URL + 'users/' + self.uuid;
        if (self.uuid == null || self.uuid.toLowerCase() === 'null') {
            //race condition edge case where the profile has loaded before the auth module
            Authorization.userIsLoaded.then(() => {
                self.uuid = self.props.params.id || Authorization.currentUser.uuid;
                self.url = GLOBALS.API_URL + 'users/' + self.uuid;
                self.forceUpdate();
            });
        }
        return {};
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
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {});
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
                <a onClick={this.showModal.bind(this, 'http://games.changemyworldnow.com/' + item.uuid)} >
                    <div className="item">
                        <span className="overlay">
                            <span className="heading">{item.title}</span>
                            <span className="text">{item.description}</span>
                            <span className="play">{PLAY}</span>
                        </span>
                        <object data={FlipBgDefault} type="image/png" >
                            <img src={'http://games.changemyworldnow.com/' + item.uuid + '/thumb.jpg'}></img>
                        </object>
                    </div>
                </a>
            </div>
        );
    },
    render: function () {
        return (
           <Layout className="profile">
                <Modal show={this.state.gameOn} onHide={this.hideModal}>
                    <Modal.Body>
                        <Game url={this.state.gameUrl} onExit={() => this.setState({gameOn: false})}/>
                    </Modal.Body>
                </Modal>
               <Trophycase data={this.state} />
               <Panel header={
                   ((this.state.uuid === Authorization.currentUser.uuid) ? 'My ' : this.state.username + '\'s ') + HEADINGS.ACTION
               } className="standard">
                 <EditLink base="/profile" uuid={this.state.uuid} canUpdate={this.state.can_update} />
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec arcu id massa fringilla condimentum. Nam ornare eget nibh vel laoreet. Donec tincidunt hendrerit nunc, varius facilisis lacus placerat eget. Sed pretium interdum pretium. Pellentesque bibendum libero eget elit consectetur iaculis. Praesent nec mi fringilla, ornare nunc at, auctor velit. Mauris gravida ipsum nisi, eu elementum erat elementum quis.

Suspendisse in maximus mauris, ut mollis libero. Nunc ut ullamcorper mauris, a interdum nisl. Vivamus posuere porttitor magna. Cras varius metus venenatis condimentum cursus. Aenean ac lacus viverra dui tincidunt suscipit. Duis condimentum velit sit amet imperdiet efficitur. Praesent sit amet varius tortor, et elementum nisl. Donec ligula ex, lacinia a accumsan non, placerat sed justo. Morbi in dui a nunc ullamcorper gravida vel sit amet diam. Fusce eget libero suscipit, vestibulum arcu non, porta sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus mauris quam, viverra vitae tellus ac, porta bibendum felis.
               </Panel>
               <Fetcher url={GLOBALS.API_URL + 'games'} >
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

