import React from 'react';
import Immutable from 'immutable';

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
        var propsForChild = Immutable.Map(this.props)
            .remove('url')
            .remove('children')
            .set('data', this.data);
        return (
            <div>
                {React.Children.map(this.props.children, child => React.cloneElement(child, propsForChild.toObject()))}
            </div>
        );
    }
});

export default Fetcher;

