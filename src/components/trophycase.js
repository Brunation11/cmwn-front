import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';

import Fetcher from 'components/fetcher';
import GLOBALS from 'components/globals';

import 'components/trophycase.scss';

import DISABLED_FLIP from 'media/flip-disabled.png';

const EARNED = 'Your earned flips: ';
const IN_PROGRESS = 'Your in progress flips: ';
const HEADINGS = {
    FLIPBOARD: 'Flipboard'
};

var Trophycase = React.createClass({
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
    renderCase: function (props) {
        var complete, inProgress;
        if (props.data && props.data.length === 0) {
            return null;
        }
        complete = _.filter(props.data, item => item.progress === 100);
        inProgress = _.difference(props.data, complete);
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
        return null;
        var Self = this;
        return (
            <Fetcher className={'trophycase ' + this.props.className} url={GLOBALS.API_URL + 'flips'} renderNoData={Self.renderCase.bind(this, {})}>
                <Self.renderCase />
            </Fetcher>
        );
    }
});

export default Trophycase;

