/* eslint-disable max-len */

var studentSchoolPage = {
    '_embedded': {
        'group': [
            {
                '_links': {
                    'group_users': {
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee14a04-0288-11e6-8625-0800274f2cef/users',
                        'label': 'Users in My Schools'
                    },
                    'self': {
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee14a04-0288-11e6-8625-0800274f2cef'
                    }
                },
                'created': '2016-05-31T20:25:09+0000',
                'deleted': null,
                'description': 'description',
                'external_id': null,
                'group_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'head': 1,
                'meta': null,
                'organization': [],
                'organization_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
                'parent': null,
                'parent_id': null,
                'scope': 0,
                'tail': 6,
                'title': 'Ginas school',
                'type': 'school',
                'updated': '2016-07-12T21:23:30+0000'
            }
        ]
    },
    '_links': {
        'find': {
            'href': 'https://api-dev.changemyworldnow.com/group{?page,per_page}',
            'templated': true
        },
        'first': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=school'
        },
        'last': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=school&page=1'
        },
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/group?type=school&page=1'
        }
    },
    'page': 1,
    'page_count': 1,
    'page_size': 25,
    'total_items': 1
}

export default studentSchoolPage;
