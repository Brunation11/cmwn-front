import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';

import 'components/trophycase.scss';

import DISABLED_FLIP from 'media/flip-disabled.png';

const EARNED = 'Your earned flips: ';
const IN_PROGRESS = 'Your in progress flips: ';
const HEADINGS = {
    FLIPBOARD: 'Flipboard'
};

var Trophycase = React.createClass({
    getInitialState: function () {
        return {
            flips: []
        };
    },
    componentDidMount: function () {
        if (this.props.data && this.props.data._embedded && this.props.data._embedded.flips) {
            this.setState({flips: this.props.data._embedded.flips});
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.data && nextProps.data._embedded && nextProps.data._embedded.flips) {
            this.setState({flips: nextProps.data._embedded.flips});
        }
    },
    renderPartial: function (items) {
        return (
           <div className="flip-list">
               {_.map(items, (item) => (<Link to="" key={Shortid.generate()}><img src={`/flips/${item.uuid}.png`} ></img><div className="partial" style={{height: `${item.progress}%`}} ><img src={`/flips/${item.uuid}_grey.png`} ></img></div></Link>))}
           </div>
        );
    },
    renderComplete: function (items) {
        return (
           <div className="flip-list">
               {_.map(items, (item) => (<Link to="" key={Shortid.generate()}><img src={`/flips/${item.uuid}.png`} ></img></Link>))}
           </div>
        );
    },
    renderCase: function () {
        var complete, inProgress;
        if (this.state && !this.state.flips.length) {
            return null;
        }
        complete = _.filter(this.state.flips, item => item.progress === 100);
        inProgress = _.difference(this.state.flips, complete);
        return (
            <Panel className="standard" header={HEADINGS.FLIPBOARD}>
                <div className="earned">
                    {EARNED}<strong>{complete.length}</strong>
                    <img className="spacer" src={DISABLED_FLIP} />
                    {this.renderComplete(complete)}
                </div>
                <div className="in-progress  hidden">
                    {IN_PROGRESS}<strong>{inProgress.length}</strong>
                    <img className="spacer" src={DISABLED_FLIP} />
                    {this.renderPartial(inProgress)}
                </div>
            </Panel>
        );
    },
    render: function () {
        return (
            this.renderCase()
        );
    }
});

export default Trophycase;

