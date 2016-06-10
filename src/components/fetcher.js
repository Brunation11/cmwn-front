/** @TODO MPR, 3/23/16: MARKED FOR DEPRECATON **/
import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

import HttpManager from 'components/http_manager';
import Log from 'components/log';

/** Marked for deprecation */
class Fetcher extends React.Component {
	constructor(props) {
		super(props);
		this.data = this.props.transform(this.props.data);
		this.state = {};
	}
	
    componentDidMount() {
        this.getData();
    }
	
    getData() {
        var urlData = HttpManager.GET({url: this.props.url});
        return urlData.then(res => {
            if (res.response.data == null && res.response._embedded == null) {
                this.data = res.response;
                Log.warn('An endpoint has returned an unexpected result (No Data Property). Attempting to proceed.'); //eslint-disable-line no-console
            } else if (this.response.data != null) {
                this.data = res.response.data;
            } else if (this.response._embedded != null) {
                this.data = res.response._embedded;
            }

            if (_.isArray(this.props.data)) {
                this.data = this.data.concat(this.props.data);
            }
            this.data = this.props.transform(this.data);
            this.forceUpdate();
            return Promise.resolve(this.data);
        }).catch(err => {
            /** @TODO MPR, 10/18/15: Implement error page */
            Log.info(err); //eslint-disable-line no-console
            this.data = this.props.data || [];
            this.data = this.props.transform(this.data);
            this.forceUpdate();
            return Promise.resolve(this.data);
        });
    }
    
    render() {
        var propsForChild;
        var props = this.props || {};

        if (this.data == null || (_.isArray(this.data) && this.data.length === 0)) {
            return (
                <div className={this.props.className}>{this.props.renderNoData()}</div>
            );
        }

        propsForChild = Immutable.Map(props)
            .remove('url')
            .remove('children')
            .remove('transform')
            .set('data', this.data);
        return (
            <div className={this.props.className}>
                {React.Children.map(this.props.children, child => React.cloneElement(child, propsForChild.toObject()))}
            </div>
        );
    }
};

Fetcher.defaultProps = {
    transform: _.identity,
    renderNoData: (() => null)
}

export default Fetcher;
