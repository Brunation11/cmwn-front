import React from 'react';
import _ from 'lodash';
import {Panel, Modal} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';
import Authorization from 'components/authorization';
import EventManager from 'components/event_manager';
import Fetcher from 'components/fetcher';
import GLOBALS from 'components/globals';

import FlipBgDefault from 'media/flip-placeholder-white.png';
import FireBg from 'media/_FIRE_title.jpg';
import FoodBg from 'media/_Food_Saver_Superhero_title.jpg';
import PrintPg from 'media/_PrintMaster_title.jpg';
import PigBg from 'media/_virtual_piggybank_title.jpg';

import 'routes/students/profile.scss';

const HEADINGS = {
    ACTION: 'Profile',
    ARCADE: 'Take Action'
};
const PLAY = 'Play Now!';

var Page = React.createClass({
    getInitialState: function () {
        this.uuid = this.props.params.id || Authorization.currentUser.uuid;
        this.url = GLOBALS.API_URL + 'users/' + this.uuid;
        if (this.uuid == null || this.uuid.toLowerCase() === 'null') {
            //race condition edge case where the profile has loaded before the auth module
            Authorization.userIsLoaded.then(() => {
                this.uuid = this.props.params.id || Authorization.currentUser.uuid;
                this.url = GLOBALS.API_URL + 'users/' + this.uuid;
                this.forceUpdate();
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
            data: _.map(Array(11), (v, i) => ({
                url: 'http://games.changemyworldnow.com/polar-bear/',
                uuid: 'adorablepuppies' + i,
                title: 'Adorable Action Item',
                description: 'Captain, why are we out here chasing comets? Yesterday I did not know how to eat gagh. We finished our first sensor sweep of the neutral zone. The game\'s not big enough unless it scares you a little.'
            })),
            gameOn: false,
            gameId: -1
        }, _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {});
        return state;
    },
    componentDidMount: function () {
        EventManager.listen('userChanged', () => {
            this.forceUpdate();
        });
    },
    showModal: function (gameUrl) {
        this.setState({gameOn: true, gameUrl});
    },
    hideModal: function () {
        this.setState({gameOn: false});
    },
    renderFlip: function (item, i){
        var bg;
        var rnd = Math.floor(Math.random() * 1000) % 5;
        /* eslint-disable curly */
        if (i === 0) bg = PigBg;
        else if (i === 1) bg = FireBg;
        else if (i === 2) bg = FoodBg;
        else if (i === 3) bg = PrintPg;
        else if (rnd === 0) bg = FlipBgDefault;
        else if (rnd === 1) bg = FireBg;
        else if (rnd === 2) bg = FoodBg;
        else if (rnd === 3) bg = PrintPg;
        else bg = PigBg;
        /* eslint-enable curly */
        return (
            <div className="flip fill">
                <a onClick={this.showModal.bind(this, item.url)} >
                    <div className="item">
                        <span className="overlay">
                            <span className="heading">{item.title}</span>
                            <span className="text">{item.description}</span>
                            <span className="play">{PLAY}</span>
                        </span>
                        <img src={bg}></img>
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
                        <Game url={this.state.gameUrl} />
                    </Modal.Body>
                </Modal>
               <Panel header={
                   ((this.state.uuid === Authorization.currentUser.uuid) ? 'My ' : this.state.username + '\'s ') + HEADINGS.ACTION
               } className="standard">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec arcu id massa fringilla condimentum. Nam ornare eget nibh vel laoreet. Donec tincidunt hendrerit nunc, varius facilisis lacus placerat eget. Sed pretium interdum pretium. Pellentesque bibendum libero eget elit consectetur iaculis. Praesent nec mi fringilla, ornare nunc at, auctor velit. Mauris gravida ipsum nisi, eu elementum erat elementum quis.

Suspendisse in maximus mauris, ut mollis libero. Nunc ut ullamcorper mauris, a interdum nisl. Vivamus posuere porttitor magna. Cras varius metus venenatis condimentum cursus. Aenean ac lacus viverra dui tincidunt suscipit. Duis condimentum velit sit amet imperdiet efficitur. Praesent sit amet varius tortor, et elementum nisl. Donec ligula ex, lacinia a accumsan non, placerat sed justo. Morbi in dui a nunc ullamcorper gravida vel sit amet diam. Fusce eget libero suscipit, vestibulum arcu non, porta sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus mauris quam, viverra vitae tellus ac, porta bibendum felis.
               </Panel>
               <FlipBoard
                   renderFlip={this.renderFlip}
                   header={HEADINGS.ARCADE} data={this.state.data}
               />
           </Layout>
        );
    }
});

export default Page;

