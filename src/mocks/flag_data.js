/* eslint-disable max-len, max-lines */

var flagData = {
    '_links': {
        'self': {
            'href': 'https://api-local.changemyworldnow.com/flag?page=1'
        },
        'first': {
            'href': 'https://api-local.changemyworldnow.com/flag'
        },
        'last': {
            'href': 'https://api-local.changemyworldnow.com/flag?page=1'
        },
        'find': {
            'href': 'https://api-local.changemyworldnow.com/flag{?page,per_page}',
            'templated': true
        }
    },
    '_embedded': {
        'flags': [
            {
                'flag_id': 'asdf',
                'flagger': {
                    'user_id': 'ecff94e4-81d5-11e6-afbf-dca314c6bb31',
                    'username': 'principal',
                    'email': 'principal@ginasink.com',
                    'first_name': 'Gina',
                    'middle_name': null,
                    'last_name': 'Principal',
                    'gender': 'male',
                    'birthdate': null,
                    'meta': [],
                    'created': '2016-09-23 21:37:28',
                    'updated': '2016-09-23 21:37:28',
                    'deleted': null,
                    'type': 'ADULT',
                    'external_id': null
                },
                'flaggee': {
                    'user_id': 'ed09fd76-81d5-11e6-ad67-c8ffc97f363d',
                    'username': 'teacher',
                    'email': 'teacher@ginasink.com',
                    'first_name': 'Gina',
                    'middle_name': null,
                    'last_name': 'Teacher',
                    'gender': 'male',
                    'birthdate': null,
                    'meta': [],
                    'created': '2016-09-23 21:37:28',
                    'updated': '2016-09-23 21:37:28',
                    'deleted': null,
                    'type': 'ADULT',
                    'external_id': null
                },
                'url': 'http://res.cloudinary.com/changemyworldnow/image/upload/v1470851001/profiles/eqfh17rdj14ldcgwta3m.jpg',
                'reason': 'so cute',
                '_links': {
                    'self': {
                        'href': 'https://api-local.changemyworldnow.com/flag/asdf'
                    }
                }
            },
            {
                'flag_id': 'qwerty',
                'flagger': {
                    'user_id': 'ecff94e4-81d5-11e6-afbf-dca314c6bb31',
                    'username': 'principal',
                    'email': 'principal@ginasink.com',
                    'first_name': 'Gina',
                    'middle_name': null,
                    'last_name': 'Principal',
                    'gender': 'male',
                    'birthdate': null,
                    'meta': [],
                    'created': '2016-09-23 21:37:28',
                    'updated': '2016-09-23 21:37:28',
                    'deleted': null,
                    'type': 'ADULT',
                    'external_id': null
                },
                'flaggee': {
                    'user_id': 'ed09fd76-81d5-11e6-ad67-c8ffc97f363d',
                    'username': 'teacher',
                    'email': 'teacher@ginasink.com',
                    'first_name': 'Gina',
                    'middle_name': null,
                    'last_name': 'Teacher',
                    'gender': 'male',
                    'birthdate': null,
                    'meta': [],
                    'created': '2016-09-23 21:37:28',
                    'updated': '2016-09-23 21:37:28',
                    'deleted': null,
                    'type': 'ADULT',
                    'external_id': null
                },
                'url': 'http://www.sealdsweet.com/img/oranges.jpg',
                'reason': 'inappropriate',
                '_links': {
                    'self': {
                        'href': 'https://api-local.changemyworldnow.com/flag/qwerty'
                    }
                }
            }
        ]
    },
    'page_count': 1,
    'page_size': 25,
    'total_items': 2,
    'page': 1
};

export default flagData;
