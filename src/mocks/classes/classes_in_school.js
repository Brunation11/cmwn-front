/* eslint-disable max-len */

var classesInSchool = {
    '_links': {
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=class&page=1'
        },
        'first': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=class'
        },
        'last': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=class&page=1'
        },
        'find': {
            'href': 'https://api-dev.changemyworldnow.com/group{?page,per_page}',
            'templated': true
        }
    },
    '_embedded': {
        'group': [
            {
                'group_id': '9ee15bf2-0288-11e6-8b6b-0800274f2cef',
                'organization_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
                'title': 'Ginas Class A',
                'description': 'Description',
                'type': 'class',
                'meta': null,
                'head': 2,
                'tail': 3,
                'external_id': null,
                'created': '2016-05-31T20:25:09+0000',
                'updated': '2016-07-12T21:23:50+0000',
                'deleted': null,
                'parent_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization': [],
                'parent': null,
                '_links': {
                    'self': {
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800274f2cef'
                    },
                    'group_users': {
                        'label': 'Users in My Classes',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800274f2cef/users'
                    },
                    'import': {
                        'label': 'Import Users',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800274f2cef/import'
                    }
                },
                'scope': 0
            },
            {
                'group_id': '9ee15bf2-0288-11e6-8b6b-0800576f2cef',
                'organization_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
                'title': 'Ginas Class B',
                'description': 'this class is awesome',
                'type': 'class',
                'meta': null,
                'head': 4,
                'tail': 5,
                'external_id': null,
                'created': '2016-06-01T23:16:53+0000',
                'updated': '2016-06-10T16:15:20+0000',
                'deleted': null,
                'parent_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization': [],
                'parent': null,
                '_links': {
                    'self': {
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800576f2cef'
                    },
                    'group_users': {
                        'label': 'Users in My Classes',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800576f2cef/users'
                    },
                    'import': {
                        'label': 'Import Users',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800576f2cef/import'
                    }
                },
                'scope': 0
            }
        ]
    },
    'page_count': 1,
    'page_size': 100,
    'total_items': 2,
    'page': 1
};

export default classesInSchool;
