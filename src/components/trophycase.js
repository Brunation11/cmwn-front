import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import {Link} from 'react-router';

import Fetcher from 'components/fetcher';
import GLOBALS from 'components/globals';

import 'components/trophycase.scss';

import DISABLED_FLIP from 'media/flip-disabled.png';
import ENABLED_FLIP from 'media/flip.png';

const EARNED = 'Your earned flips: ';
const IN_PROGRESS = 'Your in progress flips: ';
const OUT_OF = ' out of ';
const HEADINGS = {
    FLIPBOARD: 'Flipboard'
};

var Trophycase = React.createClass({
    renderPartial: function (items) {
        return (
           <div className="flip-list">
               {_.map(items, (item, i) => (<Link to="" key={i}><img src={item.image} ></img><div className="partial" style={{height: `${item.progress}%`}} ><img src={item.partial} ></img></div></Link>))}
           </div>
        );
    },
    renderComplete: function (items) {
        return (
           <div className="flip-list">
               {_.map(items, (item, i) => (<Link to="" key={i}><img src={item.image} ></img></Link>))}
           </div>
        );
    },
    renderCase: function (props) {
        var complete, inProgress;
        if (props.data == null) {
            //return null; //uncomment once you want to only use real data
            props.data = [
                {uuid: '3b215c5e-a8f9-11e5-891c-acbc32a6b1bb', description: 'lorem ipsum', title: 'Flip Title 475', partial: DISABLED_FLIP, image: ENABLED_FLIP, progress: 100},
                {uuid: '3b215c5e-a8f9-11e5-891c-acbc32a6b1bb', description: 'lorem ipsum', title: 'Flip Title 375', partial: DISABLED_FLIP, image: ENABLED_FLIP, progress: 100},
                {uuid: '3b215c5e-a8f9-11e5-891c-acbc32a6b1bb', description: 'lorem ipsum', title: 'Flip Title 225', partial: DISABLED_FLIP, image: ENABLED_FLIP, progress: 100},
                {uuid: '3b215c5e-a8f9-11e5-891c-acbc32a6b1bb', description: 'lorem ipsum', title: 'Flip Title 175', partial: DISABLED_FLIP, image: ENABLED_FLIP, progress: 34},
            ];
        }
        complete = _.filter(props.data, item => item.progress === 100);
        inProgress = _.difference(props.data, complete);
        return (
            <Panel className="standard" header={HEADINGS.FLIPBOARD}>
                <div className="earned">
                    {EARNED}<strong>{complete.length}</strong>{OUT_OF}<strong>{63/** @TODO MPR, 12/29/15: use a real number*/}</strong>
                    <img className="spacer" src={DISABLED_FLIP} />
                    {this.renderComplete(complete)}
                </div>
                <div className="in-progress hidden">
                    {IN_PROGRESS}<strong>{inProgress.length}</strong>
                    <img className="spacer" src={DISABLED_FLIP} />
                    {this.renderPartial(inProgress)}
                </div>
            </Panel>
        );
    },
    render: function () {
        var Self = this;
        return (
            <Fetcher className={'trophycase ' + this.props.className} url={GLOBALS.API_URL + 'flips/' + this.props.data.uuid} renderNoData={Self.renderCase.bind(this, {})}>
                <Self.renderCase />
            </Fetcher>
        );
    }
});

export default Trophycase;

