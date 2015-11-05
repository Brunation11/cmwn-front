import React from 'react';
import _ from 'lodash';

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

var Column = React.createClass({
    render: () => null
});

var Table = React.createClass({
    renderHeader: function () {
        var childRows;
        if (this.props.renderHeader !== false) {
            childRows = React.Children.map(this.props.children, elem => {
                if (_.isFunction(elem.props.renderHeader)) {
                    return <td>{elem.props.renderHeader()}</td>;
                } else if (_.isString(elem.props.renderHeader)) {
                    return <td>{_.startCase(elem.props.renderHeader)}</td>;
                } else {
                    return <td>{_.startCase(elem.props.dataKey)}</td>;
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
    renderRow: function (row) {
        var cells = React.Children.map(this.props.children, col  => {
            return (<td key={col.props.dataKey}>{_renderCell.call(col, row[col.props.dataKey], row)}</td>);
        });
        return (
            <tr key={Math.random()}>{''/*temporary to silence unique key warnings*/}
                {cells}
            </tr>
        );
    },
    render: function () {
        return (
            <table cellSpacing="0" cellPadding="0">
                {this.renderHeader()}
                <tbody>
                    {_.map(this.props.data, this.renderRow)}
                </tbody>
            </table>
        );
    }
});

export default {Table, Column};

