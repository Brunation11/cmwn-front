import React from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';
import Detector from 'components/browser_detector';

import Layout from 'layouts/one_col';

const PAGE_UNIQUE_IDENTIFIER = 'single-game';

var mapStateToProps;
var Page;

export class GamePage extends React.Component {
    constructor() {
        super();
        this.state = {
            isStudent: true,
        };
    }

    componentDidMount() {
        this.resolveRole(this.props);
        this.setState({
            gameId: this.props.params.game,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.resolveRole(nextProps);
        this.setState({
            gameId: this.props.params.game,
        });
    }

    resolveRole(props) {
        // remember we actually want current user here, not the user whose
        // profile we are looking at
        if (props.currentUser &&
            props.currentUser.type &&
            props.currentUser.type !== 'CHILD') {
            this.setState({
                isStudent: false
            });
        } else {
            this.setState({
                isStudent: true
            });
        }
    }

    renderOverlay() {
        if (Detector.isMobileOrTablet() && Detector.isPortrait()) {
            return (
                <div className={ClassNames(
                    'portrait-overlay',
                    {fullscreen: React.findDOMNode(this.refs.gameRef).isFullScreen()}
                )}>
                    <span><p>
                        For the best viewing experience, please turn your device to landscape orientation.
                    </p></span>
                    <p><a onClick={() => this.setState({gameOn: false})} >(close)</a></p>
                </div>
            )
        }
        return null;
    }

    render() {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                {this.renderOverlay.bind(this)}
                <Game
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={`${GLOBALS.GAME_URL}${this.props.params.game}/index.html`}
                    currentUser={this.props.currentUser}
                    onExit={() => History.push('/profile')
                    }
                />
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
