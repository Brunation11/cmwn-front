import React from 'react';

import HttpManager from 'components/http_manager'
import {Table, Column}  from 'components/table';

const data = [
    {name: 'Wavis', age: 10},
    {name: 'Sonya', age: 13},
    {name: 'Elgesor', age: 9}
];

var urlData = HttpManager.GET({url:'http://cmwn/districts'});
urlData.then(res => {
    alert('Data Recieved ' + JSON.stringify(res));
});

var Users = React.createClass({
    render: function () {return (
        <div>
            tsers
            <Table rows={data}>
                <Column dataKey="name" />
                <Column dataKey="age" />
            </Table>
        </div>
    );}
});

export default Users;

