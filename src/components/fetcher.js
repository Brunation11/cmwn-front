import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

import HttpManager from 'components/http_manager';

var Fetcher = React.createClass({
    data: [],
    getDefaultProps: function () {
        return {
            renderNoData: (() => null)
        };
    },
    componentWillMount: function () {
        this.getData();
    },
    getData: function () {
        var urlData = HttpManager.GET({url: this.props.url});
        urlData.then(res => {
            this.data = res.response.data;
            this.forceUpdate();
        }).catch(err => {
            /** @TODO MPR, 10/18/15: Implement error page */
            console.info(err); //eslint-disable-line no-console
            this.data = this.props.data;
            this.forceUpdate();
        });
    },
    render: function () {
        var propsForChild;
        if (this.data == null || (_.isArray(this.data) && this.data.length === 0)) {
            return this.props.renderNoData();
        }

        propsForChild = Immutable.Map(this.props)
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

