import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

import Skribble from 'components/game_events/skribble';

const BAD_FLIP = 'There was a problem registering your earned flip. Please try again in a little while';

export default function (eventPrefix, game, _links, exitCallback) {
    var submitFlip = function (flip) {
        if (!_links.flip.href) {
            return;
        }
        HttpManager.POST({url: _links.flip.href}, {'flip_id': flip}).catch(err => {
            Toast.error(BAD_FLIP);
            Log.log('Server refused flip update', err, flip);
        });
    };

    const DEFAULT_EVENTS = {
        Flipped: function (e) {
            submitFlip(e.gameData.id);
        },
        Flip: function (e) {
            submitFlip(e.gameData.id);
        },
        Save: function () {
        },
        Exit: function () {
            exitCallback({fullscreenFallback: false});
        },
        Init: function () {
        },
    };

    var events = DEFAULT_EVENTS;
    if (game === 'skribble') {
        events = _.defaults(Skribble, events);
    }
    return _.reduce(events, (v, k, a) => {
        a[eventPrefix + _.upperFirst(k)] = v;
        return a;
    }, {});
}
