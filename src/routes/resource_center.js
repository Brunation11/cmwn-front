import React from 'react';
import { connect } from 'react-redux';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';

export const PAGE_UNIQUE_IDENTIFIER = 'resource-center';

const TITLE = 'RESOURCE CENTER';
const CURRICULUM_LINKS = [
  {
    display: 'Getting Your Class Started with Change My World Now'
  },
];
const STUDENT_ENGAGEMENT_LINKS = [
  {
    display: 'Water Quest'
  },
  {
    display: 'Flip Challenge'
  },
  {
    display: 'Letter Challenge'
  },
  {
    display: 'Skribble Challenge'
  },
  {
    display: 'Game Design Challenge'
  },
  {
    display: 'Safety First Word Search'
  },
  {
    display: 'Polar Bear Crossword Puzzle'
  },
  {
    display: 'Drought Out Crossword Puzzle'
  },
];

var mapStateToProps;
var Page;

export class ResourceCenter extends React.Component {

    renderLinks(links) {
      return links.map(link => {
        return (
          <li>
            <a href="">{link.display}</a>
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

