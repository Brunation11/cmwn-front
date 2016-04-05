import React from 'react';
import _ from 'lodash';

import 'components/table.scss';

const BREADCRUMBS = 'Return to class list';

//we include the second param here purely to indicate to
//the reader that it may be passed to a custom renderCell
//(as may additional unnamed params
var _renderCell = function (data, row) { //eslint-disable-line
    if (_.isFunction(this.props.renderCell)) {
        return this.props.renderCell(...arguments);
    } else if (data) {
        return data;
    }
};

export var Column = React.createClass({
    render: () => null
});

export var Table = React.createClass({
    renderHeader: function () {
        var childRows;
        if (this.props.renderHeader !== false) {
            childRows = React.Children.map(this.props.children, elem => {
                if (!_.isObject(elem)) {
                    return <td>elem</td>;
                } else if (_.isFunction(elem.props.renderHeader)) {
                    return <td className={elem.props.className}>{elem.props.renderHeader()}</td>;
                } else if (_.isString(elem.props.renderHeader)) {
                    return <td className={elem.props.className}>{_.startCase(elem.props.renderHeader)}</td>;
                } else {
                    return <td className={elem.props.className}>{_.startCase(elem.props.dataKey)}</td>;
                }
            });
            return (
                <thead><tr>
                    {childRows}
                </tr></thead>
            );
        }
        return null;
    },
    renderRow: function (row, i) {
        var cells;
        if (row == null) {
            return null;
        }
        cells = React.Children.map(this.props.children, col => {
            return (<td key={col.props.dataKey} className={col.props.className}>{_renderCell.call(col, row[col.props.dataKey], row)}</td>);
        });
        return (
            <tr key={i}>
                {cells}
            </tr>
        );
    },
    render: function () {
        if (this.props.data == null || !this.props.data.length) {
            return null;
        }
        return (
            <table className={this.props.className + ' ' + 'datatable'} cellSpacing="0" cellPadding="0">
                {this.renderHeader()}
                <tbody>
                    {_.map(this.props.data, this.renderRow)}
                </tbody>
            </table>
        );
    }
});

export default {Table, Column};

