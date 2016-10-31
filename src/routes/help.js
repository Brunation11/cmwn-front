import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import LINKS from 'components/ib_links';

export const PAGE_UNIQUE_IDENTIFIER = 'help';

var mapStateToProps;
var Page;

const HEADER = 'Frequently Asked Questions';
const FAQS = {
    STUDENT: {
        label: 'Student FAQ',
        href: LINKS.FAQS.STUDENT,
        type: 'student',
    },
    TEACHER: {
        label: 'Teacher FAQ',
        href: LINKS.FAQS.TEACHER,
        type: 'teacher',
    },
    ADMIN: {
        label: 'School Admin FAQ',
        href: LINKS.FAQS.ADMIN,
        type: 'admin',
    },
};

export class Help extends React.Component {

    renderLink(data) {
        return (
            <li><a href={data.href}>
                <h2>{data.label}</h2>
            </a></li>
        );
    }

    render() {
        if (!this.props || !this.props.currentUser || this.props.currentUser.type === 'CHILD') {
            return null;
        }
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER} currentUser={this.props.currentUser}>
                <Panel header={HEADER} className="standard">
                    <ul>
                        {this.renderLink(FAQS.STUDENT)}
                        {this.renderLink(FAQS.TEACHER)}
                        {this.renderLink(FAQS.ADMIN)}
                    </ul>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var loading = true;
    var currentUser = state.currentUser;
    return {
        loading,
        currentUser,
    };
};

Page = connect(mapStateToProps)(Help);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

