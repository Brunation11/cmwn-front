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
        getMedia: function (e) {
            if (e.gameData.path === 'skribble/menu') {
                e.respond({
                    'type': 'folder',
                    'media_id': '8418112873',
                    'name': 'Menu',
                    'can_overlap': false,
                    'asset_type': 'folder',
                    'items': [
                        {
                            'type': 'folder',
                            'media_id': '8418142465',
                            'name': 'Items',
                            'can_overlap': false,
                            'asset_type': 'folder'
                        },
                        {
                            'type': 'folder',
                            'media_id': '8418116569',
                            'name': 'Messages',
                            'can_overlap': false,
                            'asset_type': 'folder'
                        }
                    ]
                });
            } else if (e.gameData.path === 'skribble/menu/items') {
                e.respond({
                    'type': 'folder',
                    'media_id': '8418142465',
                    'name': 'Items',
                    'can_overlap': false,
                    'asset_type': 'folder',
                    'items': [
                        {
                            'type': 'folder',
                            'media_id': '8418142737',
                            'name': 'Animals',
                            'can_overlap': false,
                            'asset_type': 'folder'
                        },
                        {
                            'type': 'folder',
                            'media_id': '8418131397',
                            'name': 'Backgrounds',
                            'can_overlap': false,
                            'asset_type': 'folder'
                        }
                    ]
                });
            } else if (e.gameData.path === 'skribble/menu/items/animals') {
                e.respond({
                    'type': 'folder',
                    'media_id': '8418142737',
                    'name': 'Animals',
                    'can_overlap': false,
                    'asset_type': 'folder',
                    'items': [
                        {
                            'type': 'folder',
                            'media_id': '8418143185',
                            'name': 'Dogs and Cats',
                            'can_overlap': false,
                            'asset_type': 'folder'
                        }
                    ]
                });
            } else if (e.gameData.path === 'skribble/menu/items/animals/dogs & cats') {
                e.respond({
                    'type': 'folder',
                    'media_id': '8418143185',
                    'name': 'Dogs and Cats',
                    'can_overlap': false,
                    'asset_type': 'folder',
                    'items': [
                        {
                            'type': 'file',
                            'media_id': '70116569037',
                            'name': 'img_animals_sprite.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116569037'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116576425',
                            'name': 'img_dogs_1-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116576425'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116583497',
                            'name': 'img_dogs_10-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116583497'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116593841',
                            'name': 'img_dogs_2-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116593841'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116600061',
                            'name': 'img_dogs_3-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116600061'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116607013',
                            'name': 'img_dogs_4-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116607013'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116615649',
                            'name': 'img_dogs_5-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116615649'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116620941',
                            'name': 'img_dogs_6-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116620941'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116631725',
                            'name': 'img_dogs_7-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116631725'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116637569',
                            'name': 'img_dogs_8-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116637569'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116649409',
                            'name': 'img_dogs_9-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116649409'
                        },
                        {
                            'type': 'file',
                            'media_id': '70116658101',
                            'name': 'img_dogs_sprite-01.png',
                            'can_overlap': false,
                            'asset_type': 'item',
                            'check': {
                                'type': 'sha1'
                            },
                            'src': 'https://media.changemyworldnow.com/f/70116658101'
                        }
                    ]
                });
            }
        },
        getFriends: function () {

        }
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
