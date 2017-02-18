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
            caseIndex: 0
        };
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.data) && this.props.data._embedded && this.props.data._embedded.flip) {
            this.setState({
                shelves: _.chunk(_.shuffle(this.props.data._embedded.flip), FLIP_ROW_LENGTH)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.data) && this.props.data !== nextProps.data) {
            this.setState({
                shelves: _.chunk(_.shuffle(nextProps.data._embedded.flip), FLIP_ROW_LENGTH)
            });
        }
    }

    renderEarnedShelf() {
        return (
            <div className="earned-flips">
                <button
                    className={ClassNames(
                        "nav-btn scroll-btn backward", {
                            hidden: this.state.caseIndex === 0
                        }
                    )}
                    onClick={this.scrollBackward.bind(this)}
                />
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
                    onClick=""
                />
                <button
                    className="nav-btn scroll-btn forward"
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
                        "nav-btn scroll-btn backward", {
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
                                    allFlips={shelf}
                                />
                            );
                        })}
                    </div>
                </div>
                <button
                    className="nav-btn scroll-btn forward"
                    onClick={this.scrollForward.bind(this, 'shelves')}
                />
            </div>
        );
    }

    scrollForward(ref) {
        var container;
        var offsetReference;
        var offset;

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
        var container;
        var offsetReference;
        var offset;

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

    renderMobile() {
        return(
            <div className="mobile">
                <Modal.Dialog>
                    <button className="edit-profile-btn">
                        <span className="welcome">
                            WELCOME TO DISCOVERY PAGE,
                            <br />
                            <strong>{this.props.currentUser.username}</strong>
                        </span>
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
                    <button className="profile-btn">
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
