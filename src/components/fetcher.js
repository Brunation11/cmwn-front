import React from 'react';
import Update from 'react-addons-update';

import HttpManager from 'components/http_manager';

var Fetcher = React.createClass({
    data: [],
    componentWillMount: function () {
        this.getData();
    },
    getData: function () {
        var urlData = HttpManager.GET({url: this.props.url});
        urlData.then(res => {
            this.data = res.response.data;
            this.forceUpdate();
        });
    },
    render: function () {
        var propsForChild = Update(this.props, {
            url: {$set: null},
            data: {$set: this.data}
        });
        return (
            <div>
                {React.Children.map(this.props.children, child => React.cloneElement(child, propsForChild))}
            </div>
        );
    }
});

export default Fetcher;

