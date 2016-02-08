import React from 'react';
import _ from 'lodash';

import Classnames from 'classnames';
import Shortid from 'shortid';

import 'components/feed.scss';

var Page = React.createClass({
    getDefaultProps: function () {
        return {
            data: null,
            transform: _.identity
        };
    },
    renderItems: function () {
        if (this.props.data == null) {
            return null;
        }
        return _.map(this.props.transform(this.props.data), item => {
            var date = new Date(item.created_at);
            var options = {
                weekday: 'long', month: 'short', day: 'numeric'
            };
            return (
                <li className={'feed-item ' + item.style} key={Shortid.generate()}>
                    <p className="source">
                        <span className="source-image" style={{backgroundImage: 'url(' + item.sourceImage + ')'}}></span>
                        <span className="source-user">{item.source}</span><span className="source-posted" > posted</span>
                        <span className="source-date">{date.toLocaleDateString('en-us', options)}</span>
                    </p>
                    <div className="message">
                        {(_.isString(item.message) ? item.message : _.map(item.message, message => <message.type {...message.attributes}>{message.text}</message.type>))}
                    </div>
                    <a className="image" href={item.image.href || ''}><img src={item.image.url || item.image} /></a>
                </li>
           );
        });
    },
    render: function () {
        return (
           <div className={Classnames('feed', this.props.className)}>
               <ol>
                    {this.renderItems()}
               </ol>
           </div>
        );
    }
});

export default Page;


