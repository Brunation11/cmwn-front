import React from 'react';

import {Table, Column}  from '../components/table';

const data = [
    {name: 'Davis', age: 10},
    {name: 'Sonya', age: 13},
    {name: 'Elenor', age: 9}
]

var Users = React.createClass({
    render: function () {return (
        <div>
            users
            <Table rows={data}>
                <Column dataKey="name" />
                <Column dataKey="age" />
            </Table>
        </div>
    );}
});

export default Users;

