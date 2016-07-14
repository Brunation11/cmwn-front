import React from 'react';
import _ from 'lodash';
import {Modal} from 'react-bootstrap';
import { connect } from 'react-redux';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';
import Store from 'components/store';
import Detector from 'components/browser_detector';

import Layout from 'layouts/one_col';

const PAGE_UNIQUE_IDENTIFIER = 'single-game';

var GamePage = React.createClass({
    getInitialState: function () {
        return {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html',
            isStudent: true,
            gameOn: false,
            PAGE_UNIQUE_IDENTIFIER: this.props.params.game
        };
    },
    componentDidMount: function () {
        var boundModal;
        this.resolveRole();
        boundModal = this.showModal.bind(this, GLOBALS.GAME_URL + this.props.params.game + '/index.html');
        boundModal();
    },
    componentWillReceiveProps: function () {
        this.resolveRole();
    },
    showModal: function (gameUrl) {
        var urlParts;
        if (Detector.isMobileOrTablet() || Detector.isPortrait()) {
            urlParts = gameUrl.split('/');
            urlParts.pop(); //discard index.html
            History.push(`/game/${_.last(urlParts)}`);
        }
        this.setState({gameOn: true, gameUrl});
    },
    hideModal: function () {
        this.setState({gameOn: false});
        this.refs.gameRef.dispatchPlatformEvent('quit');
        History.push('/profile');
    },
    resolveRole: function () {
        var newState = {};
        var state = Store.getState();
        if (state.currentUser && state.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    },
    renderGame: function () {
        if (!window.navigator.standalone && (Detector.isMobileOrTablet() || Detector.isIe10())) {
            return (
                <Game
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    onExit={() =>
                        History.push('/profile')
                    }
                />
            );
        }
        return (
            <div>
                <Modal
                    className="full-width"
                    show={this.state.gameOn}
                    onHide={this.hideModal}
                    keyboard={false}
                    backdrop="static"
                >
                    <Modal.Body>
                        <Game
                            ref="gameRef"
                            isTeacher={!this.state.isStudent}
                            url={this.state.gameUrl}
                            onExit={this.hideModal}
                        />
                        <a onClick={this.hideModal} className="modal-close">(close)</a>
                    </Modal.Body>
                </Modal>
            </div>
        );
    },
    render: function () {
        return (
            <Layout className={this.state.PAGE_UNIQUE_IDENTIFIER}>
                {this.renderGame()}
            </Layout>
        );
    }
});

var mapStateToProps = state => {
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


var Page = connect(mapStateToProps)(GamePage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
