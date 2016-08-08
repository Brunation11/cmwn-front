/* eslint-disable max-len */

var schoolStudentData = {
    'group_id': '628553f4-2806-11e6-a477-b9c23aa27b57',
    'organization_id': '5721abd4-2806-11e6-a057-da5d4d6df5e1',
    'title': 'June One school',
    'description': 'June One school',
    'type': 'school',
    'meta': {
        'code': '61'
    },
    'head': 1,
    'tail': 46,
    'external_id': null,
    'created': '2016-06-01T14:37:36+0000',
    'updated': '2016-06-01T14:37:36+0000',
    'deleted': null,
    'parent_id': null,
    'organization': {
        'org_id': '5721abd4-2806-11e6-a057-da5d4d6df5e1',
        'title': 'Test District 6.1',
        'description': 'Test District 6.1',
        'type': 'district',
        'meta': {
            'system_id': 1,
            'code': '61'
        },
        'created': '2016-06-01T14:37:17+0000',
        'updated': '2016-06-01T14:37:17+0000',
        'deleted': null
    },
    'parent': null,
    '_links': {
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/group/628553f4-2806-11e6-a477-b9c23aa27b57'
        },
        'group_class': {
            'label': 'My Classes',
            'href': 'https://api-dev.changemyworldnow.com/group?type=class&parent=628553f4-2806-11e6-a477-b9c23aa27b57'
        },
        'group_users': {
            'label': 'Users in My Schools',
            'href': 'https://api-dev.changemyworldnow.com/group/628553f4-2806-11e6-a477-b9c23aa27b57/users'
        }
    },
    'scope': 0
};

export default schoolStudentData;
