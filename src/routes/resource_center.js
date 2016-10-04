import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';

import 'routes/resource_center.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'resource-center';

const TITLE = 'RESOURCE CENTER';
const CURRICULUM_LINKS = [
  {
    label: 'Getting Your Class Started with Change My World Now',
    href: '',
  },
];
const STUDENT_ENGAGEMENT_LINKS = [
  {
    label: 'Water Quest',
    href: '',
  },
  {
    label: 'Flip Challenge',
    href: '',
  },
  {
    label: 'Letter Challenge',
    href: '',
  },
  {
    label: 'Skribble Challenge',
    href: '',
  },
  {
    label: 'Game Design Challenge',
    href: '',
  },
  {
    label: 'Safety First Word Search',
    href: '',
  },
  {
    label: 'Polar Bear Crossword Puzzle',
    href: '',
  },
  {
    label: 'Drought Out Crossword Puzzle',
    href: '',
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
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
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
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    return {
        data,
        loading
    };
};

Page = connect(mapStateToProps)(ResourceCenter);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

