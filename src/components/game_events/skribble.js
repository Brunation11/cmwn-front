import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';

var unboundEvents = {
    getData: function (options, e) {
        var type = e.gameData.status;
        var url = options._links.skribbles.href + '?' + (type ? 'status=' + type : '');
        HttpManager.GET(url)
            .then(server => e.respond(server.response._embedded))
            .catch(err => {
                Log.error(err);
                Toast.error('There was an error while attempting to retrieve your Skribble. ' +
                        'Please try again later.');
            });
    },
    save: _.noop,
    markAsRead: function (options, e) {
        var url = options._links.skribbles.href;
        if (e.gameData.skribble_id) {
            ga('send', 'event', 'Skribble', 'Read', e.gameData.skribble_id);
            url += '/' + e.gameData.skribble_id;
            HttpManager.PUT(url, e.gameData.skribble)
                .then(server => e.respond(server.response._embedded))
                .catch(err => Log.error(err));
        }
    },
    saveSkribble: function (options, e) {
        var url = options._links.skribbles.href;
        var skramble = e.gameData.skribble.skramble !== false;
        var skribbleData = e.gameData.skribble;
        if (skribbleData.status === 'COMPLETE') {
            return; //do not modify complete skribbles
        }
        skribbleData.items = _.map(skribbleData.items, item => {
            item.type = item.asset_type;
            return item;
        });
        skribbleData.messages = _.map(skribbleData.messages, item => {
            item.type = item.asset_type;
            return item;
        });
        if (skribbleData.skribble_id == null) {
            ga('send', 'event', 'Skribble', 'Started', skribbleData.skribble_id);
            url += (skramble ? '?skramble=' + skramble : '');
            HttpManager.POST(url, skribbleData)
                .then(server => e.respond(server.response))
                .catch(err => Log.error(err));
        } else {
            if (skramble) {
                ga('send', 'event', 'Skribble', 'Sent', skribbleData.skribble_id);
            }
            url += '/' + skribbleData.skribble_id + (skramble ? '?skramble=' + skramble : '');
            HttpManager.PUT(url, skribbleData)
                .then(server => e.respond(server.response))
                .catch(err => {
                    Log.error(err);
                    Toast.error('There was an error while attempting to save your Skribble. ' +
                        'Please try again later.');
                });
        }
    }
};

export default function (options) {
    return _.mapValues(unboundEvents, event => event.bind(null, options));
}
