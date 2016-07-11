import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Log from 'components/log';

var unboundEvents = {
    getData: function (options, e) {
        var type = e.gameData.status;
        var url = options._links.self.href + '/skribble?' + (type ? 'type=' + type : '');
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
        var scramble = e.gameData.scramble;
        if (e.gameData.skribble_id == null) {
            url += (scramble ? '?scramble=' + scramble : '');
            HttpManager.POST(url, e.gameData.skribble)
                .then(server => e.respond(server.response))
                .catch(err => Log.error(err));
        } else {
            url += e.gameData.skribble_id + (scramble ? '?scramble=' + scramble : '');
            HttpManager.PUT(url, e.gameData.skribble)
                .then(server => e.respond(server.response))
                .catch(err => Log.error(err));
        }
    }
};

export default function (options) {
    return _.mapValues(unboundEvents, event => event.bind(null, options));
}
