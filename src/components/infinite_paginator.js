import React from 'react';
import {Panel} from 'react-bootstrap';
import _ from 'lodash';
import Loader from 'react-loader';
import InfiniteScroll from 'react-infinite-scroller';
//import Shortid from 'shortid';
//import ClassNames from 'classnames';

import Log from 'components/log';
import Actions from 'components/actions';
import ACTION_CONSTANTS from 'components/action_constants';

import 'components/infinite_paginator.scss';

const COMPONENT_IDENTIFIER = 'infinite-paginator';

const LOADER_OPTIONS = {
    lines: 5,
    length: 20,
    width: 2,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 40,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    top: '50%',
    left: '50%',
    scale: 1.00
};


class InfinitePaginator extends React.Component {
    constructor() {
        super();
        this.state = {
            hasMore: true
        };
    }
    componentDidMount(){
        if (this.props.componentIdentifier == null || this.props.pageIdentifier == null) {
            Log.error('Component or Page Identifier were not provided. These properties are required');
        }
    }
    componentWillReceiveProps(nextProps) {
        var nextState = {};
        nextState = _.defaults(nextState, {'hasMore': nextProps.hasMore});
        this.setState(nextState);
    }
    getAdditionalData() {
        if (this.props.isComponentScroller) {
            /* @TODO MPR, 11/8/16: Allow toggling for non page scrollers */
        } else {
            Actions.dispatch[ACTION_CONSTANTS.GET_NEXT_INFINITE_COMPONENT_PAGE](
                this.props.state,
                this.props.componentIdentifier,
                this.props.pageIdentifier
            );
        }

        this.props.onStartGetNewData();
        //we dont need an "onNewDataRecieved" as we can simply check the incoming
        //props.data
    }

    render() {
        var self = this;
        return (
            <div className={COMPONENT_IDENTIFIER}>

               <InfiniteScroll
                  pageStart={0}
                  loadMore={this.getAdditionalData.bind(this)}
                  hasMore={this.state.hasMore}
                  initialLoad={false}
                  loader={
                        <Loader loaded={false} options={LOADER_OPTIONS} className="spinner" />
                  }
               >
                   { React.Children.map(self.props.children, child =>
                       React.cloneElement(child, {data: self.props.data}))}
               </InfiniteScroll>
            </div>
        );
    }
}

InfinitePaginator.defaultProps = {
    isComponentScroller: false,
    onStartGetNewData: _.noop
};

export default InfinitePaginator;
