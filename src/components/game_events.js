import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

import Skribble from 'components/game_events/skribble';

const BAD_FLIP = 'There was a problem registering your earned flip. Please try again in a little while';

export default function (eventPrefix, gameId, _links, exitCallback) {
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
        Save: function (e) {
            var version = e.gameData.version || 1;
            if (_links.save_game == null) {
                Log.error('Something went wrong. No game save url was provided. Game data will not be saved');
                return;
            }
            HttpManager.POST(this.props.saveUrl.replace('{game_id}', gameId),
                {data: e.gameData, version});
        },
        Exit: function () {
            exitCallback({fullscreenFallback: false});
        },
        Init: function () {
        },
    };

    var events = DEFAULT_EVENTS;
    if (gameId === 'skribble') {
        events = _.defaults(Skribble, events);
    }
    return _.reduce(events, (v, k, a) => {
        a[eventPrefix + _.upperFirst(k)] = v;
        return a;
    }, {});
}
