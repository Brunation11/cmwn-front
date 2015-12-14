import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

import HttpManager from 'components/http_manager';

var Fetcher = React.createClass({
    getInitialState: function () {
        this.data = this.props.data || [];
        return {};
    },
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
            if (_.isArray(this.props.data)) {
                this.data = this.data.concat(this.props.data);
            }
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
        var props = this.props || {};
        if (this.data == null || (_.isArray(this.data) && this.data.length === 0)) {
            return this.props.renderNoData();
        }

        propsForChild = Immutable.Map(props)
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

