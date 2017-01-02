import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';
import Shortid from 'shortid';

import Layout from 'layouts/two_col';
import Flipcase from 'components/flipcase';
import GenerateDataSource from 'components/datasource';
import HttpManager from 'components/http_manager';

import './flips.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'discover-flips';

const FLIP_SOURCE = GenerateDataSource('user_flip', PAGE_UNIQUE_IDENTIFIER);

const LABEL = 'EARNED FLIPS';

export class FlipWall extends React.Component {
    constructor() {
        super();

        this.state = {
            xOffset: 0,
            yOffset: 0,
            shelfIndex: 1
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.data) && this.props.data._embedded && this.props.data._embedded.flip) {
            this.setState({
                flips: this.props.data._embedded.flip,
                shelves: _.chunk(_.shuffle(this.props.data._embedded.flip), 4)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.data) && this.props.data !== nextProps.data) {
            this.setState({
                flips: nextProps.data._embedded.flip,
                shelves: _.chunk(_.shuffle(nextProps.data._embedded.flip), 4)
            });
        }
    }

    renderEarnedShelf() {
        return (
            <FLIP_SOURCE>
                <Flipcase
                    render="earned"
                />
            </FLIP_SOURCE>
        );
    }

    renderShelves() {
        return _.map(this.state.shelves, shelf => {
            return (
                <Flipcase
                    key={Shortid.generate()}
                    render="all"
                    allFlips={shelf}
                />
            );
        });
    }

    scrollForward(ref) {
        var container;
        var offsetReference;
        var offset;

        if (this.state.shelfIndex <= this.state.shelves.length - 3) {
            if (ref === 'shelves') {
                container = this.refs.shelves;
                offsetReference = container.firstChild;
                offset = offsetReference.offsetHeight;

                this.setState({
                    yOffset: this.state.shelfIndex * offset * -1,
                    shelfIndex: this.state.shelfIndex + 1
                });
            } else {
                container = this.refs.earned;
                offset = container.offsetWidth / 4;

                this.setState({
                    xOffset: this.state.shelfIndex * offset * -1,
                    shelfIndex: this.state.shelfIndex + 1
                });
            }

        }
    }

    scrollBackward(ref) {
        var container;
        var offsetReference;
        var offset;

        if (this.state.shelfIndex > 1) {
            if (ref === 'shelves') {
                container = this.refs.shelves;
                offsetReference = container.firstChild;
                offset = offsetReference.offsetHeight;

                this.setState({
                    yOffset: (this.state.shelfIndex - 2) * offset * -1,
                    shelfIndex: this.state.shelfIndex - 1
                });
            } else {
                container = this.refs.earned;
                offset = container.offsetWidth / 4;

                this.setState({
                    xOffset: (this.state.shelfIndex - 2) * offset * -1,
                    shelfIndex: this.state.shelfIndex - 1
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
                                {this.renderEarnedShelf()}
                            </div>
                        </div>
                        <button
                            className="nav-btn info-btn"
                            onClick=''
                        />
                        <button
                            className="nav-btn scroll-btn forward"
                            onClick={this.scrollForward.bind(this)}
                        />
                        <span className="label">
                            {LABEL}
                        </span>
                    </div>
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
                                {this.renderShelves()}
                            </div>
                        </div>
                        <button
                            className="nav-btn scroll-btn forward"
                            onClick={this.scrollForward.bind(this, 'shelves')}
                        />
                    </div>
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
