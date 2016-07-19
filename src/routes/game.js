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

var mapStateToProps;
var Page;

export class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html',
            isStudent: true,
            gameOn: false,
            PAGE_UNIQUE_IDENTIFIER: this.props.params.game
        };
    }

    componentDidMount() {
        var boundModal;
        this.resolveRole(this.props);
        boundModal = this.showModal.bind(this, GLOBALS.GAME_URL + this.props.params.game + '/index.html');
        boundModal();
    }

    componentWillReceiveProps(nextProps) {
        this.resolveRole(nextProps);
    }
    
    showModal(gameUrl) {
        var urlParts;
        if (Detector.isMobileOrTablet() || Detector.isPortrait()) {
            urlParts = gameUrl.split('/');
            urlParts.pop(); //discard index.html
            History.push(`/game/${_.last(urlParts)}`);
        }
        this.setState({gameOn: true, gameUrl});
    }
    
    hideModal() {
        this.setState({gameOn: false});
        this.refs.gameRef.dispatchPlatformEvent('quit');
        History.push('/profile');
    }

    resolveRole(props) {
        var newState = {};
        if (props.currentUser && props.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    }
    
    renderGame() {
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
                    onHide={this.setState.bind(this, { gameOn: false })}
                    keyboard={false}
                    backdrop="static"
                >
                    <Modal.Body>
                        <Game
                            ref="gameRef"
                            isTeacher={!this.state.isStudent}
                            url={this.state.gameUrl}
                            onExit={this.hideModal.bind(this)}
                        />
                        <a onClick={this.hideModal.bind(this)} className="modal-close">(close)</a>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <Layout className={this.state.PAGE_UNIQUE_IDENTIFIER}>
                {this.renderGame()}
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(GamePage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
