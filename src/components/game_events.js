/* eslint-disable max-lines */
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import GLOBALS from 'components/globals';

import Skribble from 'components/game_events/skribble';

import DefaultProfile from 'media/profile_tranparent.png';

const BAD_FLIP = 'There was a problem registering your earned flip. Please try again in a little while';

const CACH_BASE_KEY = '__base';

var mediaCache = {};

var resolveFinalMediaState = function (segments, result, parentItem = {}) {
    var url = GLOBALS.API_URL + 'media';
    var splitSegments = segments.split('/');
    var nextSegment = splitSegments.shift();
    var isBase = false;
    var item;

    if (result) parentItem.items = result._embedded.items;

    //cache hit.
    //if (mediaCache[segments] != null) return mediaCache[segments];

    //base case. we have results and no further segments to resolve
    if (!nextSegment && result != null) {
        mediaCache[segments] = parentItem;
        return Promise.resolve(parentItem);
    }

    if (result != null) {
        item = _.find(result._embedded.media, i => i.name === nextSegment);
        //api is inconsistent. The following line can be removed once this is rectified
        if (!item) item = _.find(result._embedded.items, i => i.name === nextSegment);
        if (!item) {
            return Promise.reject('Error: 404, provided media path ' + nextSegment + ' does not exist');
        }
        url += '/' + item.media_id;
    } else {
        //initial case. no results, need the base media folders
        splitSegments.unshift(nextSegment);
        if (mediaCache[CACH_BASE_KEY] != null) {
            return Promise.resolve(
                resolveFinalMediaState(splitSegments.join('/'),
                mediaCache[CACH_BASE_KEY],
                item));
        }
        isBase = true;
    }

    if (item && mediaCache[item.media_id] != null) {
        return Promise.resolve(
            resolveFinalMediaState(splitSegments.join('/'),
            mediaCache[item.media_id],
            item));
    } else {
        return HttpManager.GET(url).then(server => {
            var id = isBase ? '__base' : item.media_id;
            mediaCache[id] = server.response;
            return resolveFinalMediaState(splitSegments.join('/'), server.response, item);
        });
    }
};

export default function (eventPrefix, gameId, _links, exitCallback) {
    var origin = window.location.origin;
    var submitFlip = function (flip) {
        if (!_links.flip.href) {
            return;
        }
        HttpManager.POST({url: _links.user_flip.href}, {'flip_id': flip}).catch(err => {
            Toast.error(BAD_FLIP);
            Log.log('Server refused flip update', err, flip);
        });
    };

    var events;

    /*
     * default events. These will always fire regardless of whether or not
     * there is an event defined in addition to the submission behavior
     */
    const DEFAULT_EVENTS = {
        flipped: function (e) {
            var flipId = e.gameData.id || e.gameData.game || e.gameData.flip;
            // TODO MPR 7/14/16: .game and .flip can be removed once all games are in React
            submitFlip(flipId);
            ga('set', 'dimension5', flipId);
        },
        flip: function (e) {
            var flipId = e.gameData.id || e.gameData.game || e.gameData.flip;
            // TODO MPR 7/14/16: .game and .flip can be removed once all games are in React
            submitFlip(flipId);
            ga('set', 'dimension5', flipId);
        },
        save: function (e) {
            var version = 1;
            if (_links.save_game == null) {
                Log.error('Something went wrong. No game save url was provided. Game data will not be saved');
                return;
            }
            version = e.gameData.version || version;
            ga('set', 'metric1', e.gameData.currentScreenIndex);
            HttpManager.POST(
                _links.save_game.href.replace('{game_id}', gameId),
                {data: e.gameData, version}
            );
        },
        exit: function () {
            exitCallback({fullscreenFallback: false});
        },
        init: function (e) {
            ga('set', 'dimension4', gameId || e.gameData.id || e.gameData.game || e.gameData.flip);
            HttpManager.GET( _links.save_game.href.replace('{game_id}', gameId))
                .then(server => e.respond(server.response.data))
                .catch(err => Log.error('failed to get game data for ' + gameId, err));
        },
        getData: function (e) {
            HttpManager.GET( _links.save_game.href.replace('{game_id}', gameId))
                .then(server => e.respond(server.response))
                .catch(err => Log.error('failed to get game data for ' + gameId, err));
        },
        setData: function (e) {
            var version = 1;
            if (_links.save_game == null) {
                Log.error('Something went wrong. No game save url was provided. Game data will not be saved');
                return;
            }
            version = e.gameData.version || version;
            HttpManager.POST(
                _links.save_game.href.replace('{game_id}', gameId),
                {data: e.gameData, version}
            );
        },
        getMedia: function (e) {
            var respond = e.respond;
            e.gameData = e.gameData || {};
            if (e.gameData.media_id) {
                Log.info('Requested id ' + e.gameData.media_id);
                HttpManager.GET(GLOBALS.API_URL + 'media/' + e.gameData.media_id)
                    .then(server => respond(server.response))
                    .catch(err => Log.error(err));
            } else {
                Log.info('Requested path ' + e.gameData.path);
                e.gameData.path = e.gameData.path || 'skribble/menu';
                resolveFinalMediaState(e.gameData.path)
                    .then(response => respond(response))
                    .catch(err => Log.error(err));
            }
        },
        getFriend: function (e) {
            if (!e.gameData.friend_id) return;
            HttpManager.GET(_links.user.href + '/' + e.gameData.friend_id)
                .then(server => {
                    var friend = server.response;
                    friend._embedded = friend._embedded || {};
                    friend._embedded.image = friend._embedded.image || {};
                    friend._embedded.image.url =
                        friend._embedded.image.url || origin + DefaultProfile;
                    e.respond({user: friend});
                })
                .catch(err => Log.error(err));
        },
        getFriends: function (e) {
            HttpManager.GET(_links.friend.href)
                .then(server => {
                    var friends = _.map(server.response._embedded.friend, friend => {
                        friend._embedded = friend._embedded || {};
                        friend._embedded.image = friend._embedded.image || {};
                        friend._embedded.image.url =
                            friend._embedded.image.url || origin + DefaultProfile;
                        return friend;
                    });
                    e.respond({user: friends});
                })
                .catch(err => Log.error(err));
        }
    };

    events = DEFAULT_EVENTS;
    switch (gameId) {
        case 'skribble':
            events = _.defaults(Skribble({_links}), events);
            break;
    }

    return _.reduce(events, (a, v, k) => {
        a[eventPrefix + _.upperFirst(k)] = v;
        return a;
    }, {});
}
