import React from 'react';
import { connect } from 'react-redux';
import { Panel, Modal } from 'react-bootstrap';
import _ from 'lodash';
import Shortid from 'shortid';

import Detector from 'components/browser_detector';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Game from 'components/game';

import IB_IDS from 'components/ib_ids';

import 'routes/newsfeed.scss';

var mapStateToProps;
var Page;

const COPY = {
    PAGE_UNIQUE_IDENTIFIER: 'newsfeed',
    HEADER: 'My News Feed',
    BROWSER_NOT_SUPPORTED: (
        <span>
            <p>For the best viewing experience we recommend the desktop version in Chrome</p>
            <p>If you don't have chrome,{' '}
                <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">
                    download it for free here
                </a>.
            </p>
        </span>
    )
};

export class Feed extends React.Component {
    constructor() {
        super();

        this.state = _.defaults({
            data: [],
            games: [],
            notifications: []
        });
    }

    componentDidMount() {
        var feed;
        if (this.props.data && this.props.data._embedded && this.props.data._embedded.feed) {
            feed = this.sortData(this.props.data._embedded.feed);
            this.setState({
                data: feed,
                games: this.collectGames(feed) || [],
                notifications: this.collectNotifications(feed) || []
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        var feed;
        if (nextProps.data && nextProps.data._embedded && nextProps.data._embedded.feed) {
            feed = this.sortData(nextProps.data._embedded.feed);
            this.setState({
                data: feed,
                games: this.collectGames(feed) || [],
                notifications: this.collectNotifications() || []
            });
        }
    }

    sortData(feed) {
        return (
            _.sortBy(feed, (item) => {
                return new Date(item.created.data);
            })
        );
    }

    collectGames(feed) {
        return (
            _.filter(feed, ['type', 'game'])
        );
    }

    collectNotifications(feed) {
        return (
            _.filter(feed, ['type', 'notification'])
        );
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
                    {COPY.BROWSER_NOT_SUPPORTED}
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

    renderGameFeedItem(item) {
        var gameLink = item._links.games.href;
        var gameID = _.last(gameLink.split('/'));
        var avatar = `${GLOBALS.MEDIA_URL}${IB_IDS.FLIPS[gameID] ?
            IB_IDS.FLIPS[gameID].static :
            IB_IDS.FLIPS.default}`;
        var thumbnail = `${GLOBALS.MEDIA_URL}${IB_IDS.GAME_TILES[gameID] ?
            IB_IDS.GAME_TILES[gameID] :
            IB_IDS.GAME_TILES.default}`;
        var onClick = this.showModal.bind(this, `${GLOBALS.GAME_URL}${gameID}/index.html`);

        return (
            <div className="feed-item" id={gameID} key={Shortid.generate()}>
                <a className="wrapper" onClick={onClick.bind(this)}>
                    <div className="content">
                        <div className="author">
                            <div className="avatar">
                                <img
                                    src={avatar}
                                />
                            </div>
                            <span className="name">
                                {item.sender || item.header}
                            </span>
                        </div>
                        <div className="meta">
                            {item.message}
                        </div>
                    </div>
                    <img
                        className="banner"
                        src={thumbnail}
                    />
                </a>
            </div>
        );
    }

    render() {
        if (!this.state.data) return null;

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={COPY.PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
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
                <Panel className="standard" header={COPY.HEADER}>
                    {_.map(this.state.data, (item) => {
                        if (item.type === 'game') {
                            return this.renderGameFeedItem(item);
                        }
                    })}
                </Panel>
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
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Feed);
Page._IDENTIFIER = COPY.PAGE_UNIQUE_IDENTIFIER;
export default Page;
