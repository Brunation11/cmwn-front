import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {Panel, Modal} from 'react-bootstrap';
import Shortid from 'shortid';
import _ from 'lodash';
import ClassNames from 'classnames';

import Layout from 'layouts/two_col';
import Flipcase from 'components/flipcase';
import GenerateDataSource from 'components/datasource';
import History from 'components/history';
import HttpManager from 'components/http_manager';

import './flips.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'discover-flips';

const FLIP_SOURCE = GenerateDataSource('user_flip', PAGE_UNIQUE_IDENTIFIER);

const LABEL = 'EARNED FLIPS';

const FLIP_ROW_LENGTH = 4;

export class FlipWall extends React.Component {
    constructor() {
        super();

        this.state = {
            shelfIndex: 0,
            caseIndex: 0,
            shelves: [],
            earned: [],
        };
    }

    componentDidMount() {
        var earnedFlips;
        var allFlips;

        if (!_.isEmpty(this.props.currentUser) && this.props.currentUser._links) {
            if (!_.isEmpty(this.props.data) && this.props.data._embedded && this.props.data._embedded.flip) {
                HttpManager.GET({
                    url: (this.props.currentUser._links.user_flip.href)
                }).then(res => {
                    earnedFlips = res.response._embedded.flip_user;
                    allFlips = _.filter(this.props.data._embedded.flip, function (flip) {
                        return !_.find(earnedFlips, ['flip_id', flip.flip_id]);
                    });
                    this.setState({
                        earned: earnedFlips,
                        shelves: _.chunk(_.shuffle(allFlips), FLIP_ROW_LENGTH)
                    });
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        var earnedFlips;
        var allFlips;

        if (!_.isEmpty(nextProps.currentUser) && this.props.currentUser !== nextProps.currentUser) {
            if (!_.isEmpty(nextProps.data) && this.props.data !== nextProps.data) {
                HttpManager.GET({
                    url: (nextProps.currentUser._links.user_flip.href)
                }).then(res => {
                    earnedFlips = res.response._embedded.flip_user;
                    allFlips = _.filter(nextProps.data._embedded.flip, function (flip) {
                        return !_.find(earnedFlips, ['flip_id', flip.flip_id]);
                    });
                    this.setState({
                        earned: earnedFlips,
                        shelves: _.chunk(_.shuffle(allFlips), FLIP_ROW_LENGTH)
                    });
                });
            }
        }
    }

    renderEarnedShelf() {
        if (this.props.currentUser.type !== 'CHILD') return null;

        return (
            <div className="earned-flips">
                <button
                    className={ClassNames(
                        'nav-btn scroll-btn backward', {
                            hidden: this.state.caseIndex === 0
                        }
                    )}
                    onClick={this.scrollBackward.bind(this)}
                />
                <span className="count">
                    {this.state.earned.length}
                </span>
                <div className="earned-container">
                    <div
                        ref="earned"
                        className="earned"
                        style={{
                            marginLeft: `${this.state.caseIndex * -25}%`
                        }}
                    >
                        <FLIP_SOURCE>
                            <Flipcase
                                ref="flipcase"
                                render="earned"
                            />
                        </FLIP_SOURCE>
                    </div>
                </div>
                <button
                    className="nav-btn info-btn"
                    onClick={this.renderNavigate.bind(this, '/profile')}
                />
                <button
                    className={ClassNames(
                        'nav-btn scroll-btn forward', {
                            hidden: this.state.caseIndex >= this.state.earned.length - 4
                        }
                    )}
                    onClick={this.scrollForward.bind(this)}
                />
                <span className="label">
                    {LABEL}
                </span>
            </div>
        );
    }

    renderShelves() {
        return (
            <div className="all-flips">
                <button
                    className={ClassNames(
                        'nav-btn scroll-btn backward', {
                            hidden: this.state.shelfIndex === 0
                        }
                    )}
                    onClick={this.scrollBackward.bind(this, 'shelves')}
                />
                <div ref="shelf-container" className="shelf-container">
                    <div
                        ref="shelves"
                        className="shelves"
                        style={{
                            marginTop: `${this.state.shelfIndex * -30}%`
                        }}
                    >
                        {_.map(this.state.shelves, shelf => {
                            return (
                                <Flipcase
                                    key={Shortid.generate()}
                                    render="all"
                                    static={true}
                                    allFlips={shelf}
                                />
                            );
                        })}
                    </div>
                </div>
                <button
                    className={ClassNames(
                        'nav-btn scroll-btn forward', {
                            hidden: this.state.shelves &&
                                    (this.state.shelfIndex >= this.state.shelves.length - 3)
                        }
                    )}
                    onClick={this.scrollForward.bind(this, 'shelves')}
                />
            </div>
        );
    }

    scrollForward(ref) {
        if (ref === 'shelves') {
            if (this.state.shelfIndex < this.state.shelves.length - 3) {
                this.setState({shelfIndex: this.state.shelfIndex + 1});
            }
        } else {
            if (this.state.caseIndex < this.refs.flipcase.props.data.length - 4) {
                this.setState({caseIndex: this.state.caseIndex + 1});
            }
        }
    }

    scrollBackward(ref) {
        if (ref === 'shelves') {
            if (this.state.shelfIndex > 0) {
                this.setState({shelfIndex: this.state.shelfIndex - 1});
            }
        } else {
            if (this.state.caseIndex > 0) {
                this.setState({caseIndex: this.state.caseIndex - 1});
            }
        }
    }

    renderNavigate(path) {
        History.push(path);
    }

    renderMobile() {
        return (
            <div className="mobile">
                <Modal.Dialog>
                    <button
                        className="edit-profile-btn"
                        onClick={this.renderNavigate.bind(this, '/profile/edit')}
                    >
                        <span className="welcome">
                            WELCOME TO DISCOVERY PAGE,
                            <br />
                            <strong>{this.props.currentUser.username}</strong>
                        </span>
                        <img className="profile-img" src={this.props.currentUser._embedded.image.url} />
                        <span className="tap-to-view">
                            TAP TO<strong> VIEW PROFILE</strong>
                        </span>
                    </button>
                    {this.renderEarnedShelf()}
                    {this.renderShelves()}
                    <span className="notice">
                        swipe up
                        <span className="btn"></span>
                        for more shelves
                    </span>
                    <button
                        className="profile-btn"
                        onClick={this.renderNavigate.bind(this, '/profile')}
                    >
                        <span className="tap-to-return">
                            TAP TO<strong> VIEW PROFILE</strong>
                        </span>
                    </button>
                </Modal.Dialog>
            </div>
        );
    }

    render() {
        if (_.isEmpty(this.props.data) || !this.props.data._embedded) return null;

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                <Panel className="standard flip-wall">
                    {this.renderMobile()}
                    {this.renderEarnedShelf()}
                    {this.renderShelves()}
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

Page = connect(mapStateToProps)(FlipWall);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
