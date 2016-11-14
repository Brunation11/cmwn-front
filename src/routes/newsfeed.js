import React from 'react';
import { connect } from 'react-redux';
import { Panel, Modal } from 'react-bootstrap';
import _ from 'lodash';
import Shortid from 'shortid';

import Detector from 'components/browser_detector';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Game from 'components/game';

import 'routes/newsfeed.scss';

var mapStateToProps;
var Page;

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
        var avatar = `/flips/${gameID}-static.gif`;
        var thumbnail = `${GLOBALS.MEDIA_URL}${TITLES[gameID] ? TITLES[GAMEID] : TITLES.default}`;
        var onClick = this.showModal.bind(this, `${GLOBALS.GAME_URL}${gameID}/index.html`);

        return (
            <div className="feed-item" id={gameID} key={Shortid.generate()}>
                <a onClick={onClick.bind(this)}>
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
