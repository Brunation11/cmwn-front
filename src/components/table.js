import React from 'react';
import _ from 'lodash';


var _renderCell = function (data, row) {
    if (_.isFunction(this.props.renderCell)) {
        return this.props.renderCell(...arguments);
    } else if (data) {
        return data;
    }
}

var Column = React.createClass({
    render: () => null
});

var Table = React.createClass({
    renderHeader: function () {
        var childRows;
        if (this.props.renderHeader !== false) {
            childRows = React.Children.map(this.props.children, elem => {
                if (_.isFunction(elem.renderHeader)) {
                    return <td>{elem.renderHeader()}</td>
                } else if (_.isString(elem.renderHeader)) {
                    return <td>{_.startCase(elem.renderHeader)}</td>
                } else {
                    return <td>{_.startCase(elem.props.dataKey)}</td>
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
            return (<td key={col.props.dataKey}>{_renderCell.call(col, row[col.props.dataKey], row)}</td>)
        });
        return (
            <tr key={Math.random()}>{''/*temporary to silence unique key warnings*/}
                {cells}
            </tr>
        );
    },
    render: function () {
        return (
            <table>
                {this.renderHeader()}
                <tbody>
                    {_.map(this.props.rows, this.renderRow)}
                </tbody>
            </table>
        );
    }
});

export default {Table, Column};

