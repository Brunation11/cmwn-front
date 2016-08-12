import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';
import QueryString from 'query-string';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import Shortid from 'shortid';
import Toast from 'components/toast';
import FlipBoard from 'components/flipboard';
import EditLink from 'components/edit_link';
import Util from 'components/util';
import GenerateDataSource from 'components/datasource';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/classes/user_cards.scss';

const PAGE_UNIQUE_IDENTIFIER = 'user-card-generator';

const USER_SOURCE = GenerateDataSource('group_users', PAGE_UNIQUE_IDENTIFIER);

const COPY = {
    DISCLAIMER: 'For security reasons, you must reset your password and log in again',
    SITELINK: 'www.ChangeMyWorldNow.com',
    HEADING_1: 'Student:',
    HEADING_2: 'Username:'
};

var mapStateToProps;
var Page;

export class UserCards extends React.Component {
    constructor() {
        super();
        this.state = {
            isStudent: true
        };
    }
    componentDidMount() {
        this.setState(this.props.data);
        this.resolveRole(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
        this.resolveRole(nextProps);
    }
    resolveRole() {
        var newState = {};
        if (this.props.currentUser && this.props.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    }
    renderFlip(item){
        return (
            <div className="card" key={Shortid.generate()}>
                <div className="heading-container-1"><span className="heading"><strong>{COPY.HEADING_1}</strong></span></div>
                <div className="user-info-container-1"><span className="user-info">{`${item.first_name} ${item.last_name}`}</span></div>
                <h1 className="site-link">{COPY.SITELINK}</h1>
                <div className="heading-container-2"><span className="heading"><strong>{COPY.HEADING_2}</strong></span></div>
                <div className="user-info-container-2"><span className="user-info">{item.username}</span></div>
                <p className="disclaimer">{COPY.DISCLAIMER}</p>
            </div>
        );
    }
    render() {
        if (this.props.data == null || this.state == null) {
            return null;
        }
        return (
            <div className="user-cards">
                <USER_SOURCE>
                    <FlipBoard
                        renderFlip={this.renderFlip}
                        header={this.props.data.title}
                    />
                    <a className="btn standard purple print" href="javascript:window.print()">PRINT</a>
                </USER_SOURCE>
            </div>
        );
    }
}

UserCards.defaultProps = {
    data: {}
};

mapStateToProps = state => {
    var data = {};
    var currentUser = {}; // eslint-disable-line no-unused-vars
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        if (state.currentUser != null){
            currentUser = state.currentUser;
        }

    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(UserCards);
export default Page;

