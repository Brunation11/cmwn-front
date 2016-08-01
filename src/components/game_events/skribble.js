import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Log from 'components/log';

var unboundEvents = {
    getData: function (options, e) {
        var type = e.gameData.status;
        var url = options._links.self.href + '/skribble?' + (type ? 'status=' + type : '');
        HttpManager.GET(url)
            .then(server => e.respond(server.response._embedded))
            .catch(err => Log.error(err));
    },
    save: _.noop,
    markAsRead: function (options, e) {
        var url;
        if (e.gameData.skribble_id) {
            url = options._links.self.href + '/skribble/' + e.gameData.skribble_id;
            HttpManager.PUT(url, e.gameData.skribble)
                .then(server => e.respond(server.response._embedded))
                .catch(err => Log.error(err));
        }
    },
    saveSkribble: function (options, e) {
        var url = options._links.self.href + '/skribble';
        var skramble = e.gameData.skribble.skramble;
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
            url += (skramble ? '?skramble=' + skramble : '');
            HttpManager.POST(url, skribbleData)
                .then(server => e.respond(server.response))
                .catch(err => Log.error(err));
        } else {
            url += '/' + skribbleData.skribble_id + (skramble ? '?skramble=' + skramble : '');
            HttpManager.PUT(url, skribbleData)
                .then(server => e.respond(server.response))
                .catch(err => Log.error(err));
        }
    }
};

export default function (options) {
    return _.mapValues(unboundEvents, event => event.bind(null, options));
}
