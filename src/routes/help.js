import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Panel } from 'react-bootstrap';

import Layout from 'layouts/two_col';

export const PAGE_UNIQUE_IDENTIFIER = 'help';

var mapStateToProps;
var Page;

const MEDIA_URL = 'https://media-staging.changemyworldnow.com/f';

const FAQs = {
    student: {
        label: "Student FAQ",
        href: `${MEDIA_URL}/ad969fcf71ecda4f1e5a72f05863bf37`,
        src: `${MEDIA_URL}/ad969fcf71ecda4f1e5a72f05863bf37&compressiontype=2&size=25`,
    },
    teacher: {
        label: "Student FAQ",
        href: `${MEDIA_URL}/09258b65b267583dbd0eedc434d5b11f`,
        src: `${MEDIA_URL}/09258b65b267583dbd0eedc434d5b11f&compressiontype=2&size=25`,
    },
    admin: {
        label: "Student FAQ",
        href: `${MEDIA_URL}/15d775ce44bc7dec5e8c74333ef7c93b`,
        src: `${MEDIA_URL}/15d775ce44bc7dec5e8c74333ef7c93b&compressiontype=2&size=25`,
    },
};

export class Help extends React.Component {
    renderLink(data) {
        return (
            <Link to={data.href}>
                <img alt={data.label} src={data.img} />
                <h2>{data.label}</h2>
            </Link>
        )
    }
    render() {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <Panel header="HELP" className="standard">
                    {this.renderLink(FAQs.student)}
                    {this.renderLink(FAQs.teacher)}
                    {this.renderLink(FAQs.principal)}
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

