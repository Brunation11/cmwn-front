import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';

import 'routes/resource_center.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'resource-center';

const TITLE = 'RESOURCE CENTER';
const MEDIA_URL = 'https://media-staging.changemyworldnow.com/f';
export const CURRICULUM_LINKS = [
    {
        label: 'Getting Your Class Started with Change My World Now',
        href: `${MEDIA_URL}/799d3519627884d48bba3df07d5130c7.pdf,
    },
];
export const STUDENT_ENGAGEMENT_LINKS = [
    {
        label: 'Water Quest',
        href: `${MEDIA_URL}/45902caa5636b7aa6685b55cf50d3db5.pdf`,
    },
    {
        label: 'Flip Challenge',
        href: `${MEDIA_URL}/7d5a14053439e803ade8f04b8050bb34.pdf`,
    },
    {
        label: 'Letter Challenge',
        href: `${MEDIA_URL}/57b1bfa09153cd8370fad398d2cd76ea.pdf`,
    },
    {
        label: 'Skribble Challenge',
        href: `${MEDIA_URL}/ec8627b69d8d0ff5b64617f8dd6ef3a3.pdf`,
    },
    {
        label: 'Game Design Challenge',
        href: `${MEDIA_URL}/765d80bf72d20d391ba1f012b8154bcf.pdf`,
    },
    {
        label: 'Safety First Word Search',
        href: `${MEDIA_URL}/5d770f466747743c647ab80e3696761b.pdf`,
    },
    {
        label: 'Polar Bear Crossword Puzzle',
        href: `${MEDIA_URL}/ad1bd87d9db72371ce769e2a649bc73b.pdf`,
    },
    {
        label: 'Drought Out Crossword Puzzle',
        href: `${MEDIA_URL}/bafc471d2ef8a7d0a1931e69f87a7071.pdf`,
    },
];

var mapStateToProps;
var Page;

export class ResourceCenter extends React.Component {

    renderLinks(links) {
        return links.map(link => {
            return (
                <li>
                    <a href={link.href}>{link.label}</a>
                </li>
            );
        });
    }

    render() {
        if (this.props.currentUser && this.props.currentUser.type === 'ADULT') {
            return (
                <Layout className={PAGE_UNIQUE_IDENTIFIER} currentUser={this.props.currentUser}>
                    <Panel header={TITLE} className="standard">
                        <h1>CURRICULUM</h1>
                        <ul>
                            {this.renderLinks(CURRICULUM_LINKS)}
                        </ul>
                        <h1>STUDENT ENGAGEMENT</h1>
                        <ul>
                            {this.renderLinks(STUDENT_ENGAGEMENT_LINKS)}
                        </ul>
                    </Panel>
                </Layout>
            );
        }

        return null;
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser,
    };
};

Page = connect(mapStateToProps)(ResourceCenter);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

