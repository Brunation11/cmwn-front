import React from 'react';
import _ from 'lodash';
import {Panel, Modal} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import Game from 'components/game';

import FlipBgDefault from 'media/flip-placeholder-white.png';

import 'routes/students/profile.scss';

const HEADINGS = {
    ACTION: 'Action Items',
    ARCADE: 'Arcade'
};
const PLAY = 'Play Now!';

var Page = React.createClass({
    getInitialState: function () {
        return {
            data: _.map(Array(10), (v, i) => ({
                url: i,
                uuid: 'adorablepuppies' + i,
                title: 'Adorable Action Item',
                description: 'Captain, why are we out here chasing comets? Yesterday I did not know how to eat gagh. We finished our first sensor sweep of the neutral zone. The game\'s not big enough unless it scares you a little.'
            })),
            gameOn: false,
            gameId: -1
        };
    },
    showModal: function (gameId) {
        this.setState({gameOn: true, gameId});
    },
    hideModal: function () {
        this.setState({gameOn: false});
    },
    renderFlip: function (item) {
        return (
        <div className="flip">
            <a onClick={this.showModal.bind(this, item.uuid)} >
                <div className="item">
                    <span className="overlay">
                        <span className="heading">{item.title}</span>
                        <span className="text">{item.description}</span>
                        <span className="play">{PLAY}</span>
                    </span>
                    <img src={FlipBgDefault}></img>
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
                        <Game uuid={this.state.gameId} />
                    </Modal.Body>
                </Modal>
               <Panel header={HEADINGS.ACTION} className="standard">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec arcu id massa fringilla condimentum. Nam ornare eget nibh vel laoreet. Donec tincidunt hendrerit nunc, varius facilisis lacus placerat eget. Sed pretium interdum pretium. Pellentesque bibendum libero eget elit consectetur iaculis. Praesent nec mi fringilla, ornare nunc at, auctor velit. Mauris gravida ipsum nisi, eu elementum erat elementum quis.

Suspendisse in maximus mauris, ut mollis libero. Nunc ut ullamcorper mauris, a interdum nisl. Vivamus posuere porttitor magna. Cras varius metus venenatis condimentum cursus. Aenean ac lacus viverra dui tincidunt suscipit. Duis condimentum velit sit amet imperdiet efficitur. Praesent sit amet varius tortor, et elementum nisl. Donec ligula ex, lacinia a accumsan non, placerat sed justo. Morbi in dui a nunc ullamcorper gravida vel sit amet diam. Fusce eget libero suscipit, vestibulum arcu non, porta sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus mauris quam, viverra vitae tellus ac, porta bibendum felis.
               </Panel>
               <FlipBoard
                   renderFlip={this.renderFlip}
                   heading={HEADINGS.ACTION} data={this.state.data}
               />
           </Layout>
        );
    }
});

export default Page;

