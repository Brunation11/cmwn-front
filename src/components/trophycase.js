import React from 'react';
import {Panel} from 'react-bootstrap';

import DISABLED_FLIP from 'media/flip-disabled.png';
import ENABLED_FLIP from 'media/flip.png';

const EARNED = 'Your earned flips: ';
const IN_PROGRESS = 'Your in progress flips: ';
const OUT_OF = ' out of ';

var Trophycase = React.createClass({
    render: function () {
        return (
            <Panel className="standard">
                <div className="earned">
                    
                </div>
                <div className="in-progress">
                </div>
            </Panel>
        );
    }
});

export default Trophycase;

