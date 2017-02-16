import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';
import Shortid from 'shortid';
import _ from 'lodash';

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
            xOffset: 0,
            yOffset: 0,
            shelfIndex: 1,
            caseIndex: 1
        };
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.data) && this.props.data._embedded && this.props.data._embedded.flip) {
            this.setState({
                flips: this.props.data._embedded.flip,
                shelves: _.chunk(_.shuffle(this.props.data._embedded.flip), FLIP_ROW_LENGTH)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.data) && this.props.data !== nextProps.data) {
            this.setState({
                flips: nextProps.data._embedded.flip,
                shelves: _.chunk(_.shuffle(nextProps.data._embedded.flip), FLIP_ROW_LENGTH)
            });
        }
    }

    renderEarnedShelf() {
        return (
            <div className="earned-flips">
                <button
                    className="nav-btn scroll-btn backward"
                    onClick={this.scrollBackward.bind(this)}
                />
                <div className="earned-container">
                    <div
                        ref="earned"
                        className="earned"
                        style={{
                            marginLeft: this.state.xOffset
                        }}
                    >
                        <FLIP_SOURCE>
                            <Flipcase
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
                    className="nav-btn scroll-btn backward"
                    onClick={this.scrollBackward.bind(this, 'shelves')}
                />
                <div className="shelf-container">
                    <div
                        ref="shelves"
                        className="shelves"
                        style={{
                            marginTop: this.state.yOffset
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
            if (this.state.shelfIndex <= this.state.shelves.length - 3) {
                container = this.refs.shelves;
                offsetReference = container.firstChild;
                offset = offsetReference.offsetHeight;

                this.setState({
                    yOffset: this.state.shelfIndex * offset * -1,
                    shelfIndex: this.state.shelfIndex + 1
                });
            }
        } else {
            container = this.refs.earned;
            offset = container.offsetWidth / 4;
            if (this.state.caseIndex <= container.children[0].children[0].children.length - 5) {
                this.setState({
                    xOffset: this.state.caseIndex * offset * -1,
                    caseIndex: this.state.caseIndex + 1
                });
            }
        }
    }

    scrollBackward(ref) {
        var container;
        var offsetReference;
        var offset;

        if (ref === 'shelves') {
            if (this.state.shelfIndex > 1) {
                container = this.refs.shelves;
                offsetReference = container.firstChild;
                offset = offsetReference.offsetHeight;

                this.setState({
                    yOffset: (this.state.shelfIndex - 2) * offset * -1,
                    shelfIndex: this.state.shelfIndex - 1
                });
            }
        } else {
            if (this.state.caseIndex > 1) {
                container = this.refs.earned;
                offset = container.offsetWidth / 4;

                this.setState({
                    xOffset: (this.state.caseIndex - 2) * offset * -1,
                    caseIndex: this.state.caseIndex - 1
                });
            }
        }
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
