import React from 'react';
import {Panel, ButtonGroup, Button, DropdownButton, MenuItem} from 'react-bootstrap';
import _ from 'lodash';
//import ClassNames from 'classnames';

import GLOBALS from 'components/globals';
import Actions from 'components/actions';
import Store from 'components/store';

import 'components/paginator.scss';

var _getButtonPattern = function (currentPage, pageCount) {
    var pattern;
    if (pageCount <= 5) {
        pattern = _.map(Array(pageCount), (v, i) => i + 1);
    } else if (currentPage === 1 && currentPage === pageCount) {
        pattern = [1, 2, '...', pageCount - 1, pageCount];
    } else if (currentPage === 2) {
        pattern = [1, 2, 3, '...', 5];
    } else if (currentPage === pageCount - 1) {
        pattern = [1, '...', pageCount - 2, pageCount - 1, pageCount];
    } else {
        pattern = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pageCount];
    }
    pattern.unshift('<');
    pattern.push('>');
    return pattern;
};

/**
 * A generic paginator. Reqires a 'data' prop that will be attached to any children
 * of the paginator.
 */
var Paginator = React.createClass({
    getDefaultProps: function () {
        return {
            onPageChange: _.identity,
            onRowCountChange: _.identity,
            pagePaginator: false
        };
    },
    getInitialState: function () {
        return {
            rowCount: this.props.rowCount || GLOBALS.PAGINATOR_COUNTS[0],
            currentPage: this.props.currentPage || 1,
            pageCount: this.props.pageCount || 1
        };
    },
    componentWillReceiveProps: function (nextProps) {
        var rowCount = nextProps.rowCount || this.props.rowCount;
        var currentPage = nextProps.currentPage || this.props.currentPage;
        var pageCount = nextProps.pageCount || this.props.pageCount;
        this.setState({rowCount, currentPage, pageCount});
    },
    selectPage: function (pageNum, isPagePaginator) {
        this.props.onPageChange(pageNum);
        if (isPagePaginator) {
            Actions.GET_NEXT_PAGE_PAGE(Store.getState(), pageNum);
        } else {
            Actions.GET_NEXT_COMPONENT_PAGE(Store.getState(),
                this.props.endpointIdentifier, this.props.componentName, pageNum);
        }
        this.setState({currentPage: pageNum});
    },
    selectRowCount: function (e, count, isPagePaginator = this.props.pagePaginator) {
        this.props.onRowCountChange(count);
        if (isPagePaginator) {
            Actions.CHANGE_PAGE_ROW_COUNT(Store.getState(), count);
        } else {
            Actions.CHANGE_COMPONENT_ROW_COUNT(Store.getState(),
                this.props.endpointIdentifier, this.props.componentName, count);
        }
        this.setState({rowCount: count});
    },
    renderPageSelectors: function () {
        var self = this;
        return _.map(_getButtonPattern(self.state.currentPage, self.state.pageCount), value => {
            if (value === '<') {
                return (<Button key={value} onClick={self.selectPage.bind(self,
                    Math.max(1, self.state.currentPage - 1), self.props.pagePaginator)}>{value}</Button>);
            } else if (value === '>') {
                return (<Button key={value} onClick={self.selectPage.bind(self,
                    Math.min(self.state.pageCount, self.state.currentPage + 1),
                        self.props.pagePaginator)}>{value}</Button>);
            } else if (value === '...') {
                return (<Button key={value} disabled={true}>{value}</Button>);
            } else {
                return (<Button key={value} onClick={self.selectPage.bind(self, value,
                    self.props.pagePaginator)}>{value}</Button>);
            }
        });
    },
    renderRowCountChoices: function () {
        return _.map(GLOBALS.PAGINATOR_COUNTS, value =>
            <MenuItem value={value} eventKey={value} key={value}>{value}</MenuItem>);
    },
    render: function () {
        var self = this;
        if (self.props.data == null || !self.props.data.length) {
            return null;
        }
        return (
            <Panel className="paginator">
                <div>
                    {React.Children.map(self.props.children, child =>
                        React.cloneElement(child, {data: self.props.data}))}
                </div>
                <footer>
                    <ButtonGroup>
                        <DropdownButton
                            id="row-count"
                            title={`Showing ${self.state.rowCount} rows`}
                            onSelect={self.selectRowCount}
                        >
                            {self.renderRowCountChoices()}
                        </DropdownButton>
                        {self.renderPageSelectors()}
                   </ButtonGroup>
                </footer>
            </Panel>
        );
    }
});

export default Paginator;
