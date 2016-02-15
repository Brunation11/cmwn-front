import React from 'react';
import ReactDOM from 'react-dom';

import 'components/loading_icon.scss';

var Page = React.createClass({
    componentDidMount: function () {
        var LoaderDomElement = ReactDOM.findDOMNode(this.refs.loaderRef);//eslint-disable-line no-unused-vars
    },
    render: function () {
        return (
           <div ref="loaderRef" className="loadingIcon anyOtherClasses">
           </div>
        );
    }
});

export default Page;

