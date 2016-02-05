import React from 'react';
import _ from 'lodash';
import Classnames from 'classnames';
import Shortid from 'shortid';

var Page = React.createClass({
    getDefaultProps: function () {
        return {
            data: null,
            transform: _.identity
        };
    },
    renderItem: function () {
        if (this.props.data == null) {
            return null;
        }
        return _.map(this.props.transform(this.props.data), item => {
            return (
                <li className={item.style} key={Shortid.generate()}>
                    <img src={item.image} />
                    <span>{item.message}</span>
                </li>
           );
        });
    },
    render: function () {
        return (
           <div className={Classnames('feed', ...this.props.className)}>
               <ol>
                    {this.renderItem}
               </ol>
           </div>
        );
    }
});

export default Page;


