import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

import Layout from 'layouts/two_col';

export const PAGE_UNIQUE_IDENTIFIER = 'help';

var mapStateToProps;
var Page;

const MEDIA_URL = 'https://media-staging.changemyworldnow.com/f';

export const FAQs = {
    student: {
        label: "Student FAQ",
        href: `${MEDIA_URL}/ad969fcf71ecda4f1e5a72f05863bf37.pdf`,
        type: "student",
    },
    teacher: {
        label: "Teacher FAQ",
        href: `${MEDIA_URL}/09258b65b267583dbd0eedc434d5b11f.pdf`,
        type: "teacher",
    },
    admin: {
        label: "School Admin FAQ",
        href: `${MEDIA_URL}/15d775ce44bc7dec5e8c74333ef7c93b.pdf`,
        type: "admin",
    },
};

export class Help extends React.Component {
    componentWillReceiveProps(props) {
        if (props.currentUser && props.currentUser.type === 'CHILD') {
            window.location.replace(FAQs.student.href);
        }
    }
    renderLink(data) {
        return (
            <li><a href={data.href}>
                <h2>{data.label}</h2>
            </a></li>
        )
    }
    render() {
        if (!this.props || !this.props.currentUser || this.props.currentUser.type === 'CHILD') {
            return null;
        }
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <Panel header="HELP" className="standard">
                    <ul>
                        {this.renderLink(FAQs.student)}
                        {this.renderLink(FAQs.teacher)}
                        {this.renderLink(FAQs.admin)}
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

