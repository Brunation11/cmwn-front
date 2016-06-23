var teacherData = {
    'user_id': 'c54d6b64-276d-11e6-85b7-a188177b4f51',
    'username': 'teacher',
    'email': 'teacher@ginasink.com',
    'first_name': 'Gina',
    'middle_name': null,
    'last_name': 'Teacher',
    'gender': 'male',
    'birthdate': null,
    'meta': [],
    'created': '2016-05-31 20:25:09',
    'updated': '2016-06-13 19:47:24',
    'deleted': null,
    'type': 'ADULT',
    'external_id': null,
    'token': '67259428315d048c6759ea9f41d4ab51-1a0138d3e2d1fa0d400016bf360c5bbb',
    '_links': {
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/user/c54d6b64-276d-11e6-85b7-a188177b4f51'
        },
        'profile': {
            'label': 'Profile',
            'href': 'https://api-dev.changemyworldnow.com/user/c54d6b64-276d-11e6-85b7-a188177b4f51'
        },
        'user_image': {
            'label': 'Profile Image',
            'href': 'https://api-dev.changemyworldnow.com/user/c54d6b64-276d-11e6-85b7-a188177b4f51/image'
        },
        'user': {
            'label': 'Friends and Network',
            'href': 'https://api-dev.changemyworldnow.com/user'
        },
        'games': {
            'label': 'Games',
            'href': 'https://api-dev.changemyworldnow.com/game'
        },
        'flip': {
            'label': 'Flips',
            'href': 'https://api-dev.changemyworldnow.com/flip'
        },
        'password': {
            'label': 'Change Password',
            'href': 'https://api-dev.changemyworldnow.com/user/c54d6b64-276d-11e6-85b7-a188177b4f51/password'
        },
        'save_game': {
            'Label': 'Save Game',
            'templated': true,
            'href': 'https://api-dev.changemyworldnow.com/user/c54d6b64-276d-11e6-85b7-a188177b4f51/game/{game_id}'
        },
        'group_class': {
            'label': 'My Classes',
            'href': 'https://api-dev.changemyworldnow.com/group?type=class'
        },
        'group_school': {
            'label': 'My Schools',
            'href': 'https://api-dev.changemyworldnow.com/group?type=school'
        },
        'org_district': {
            'label': 'My Districts',
            'href': 'https://api-dev.changemyworldnow.com/org?type=district'
        }
    },
    'scope': 2,
    '_embedded': {
        'groups': [
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
                'updated': '2016-06-13T20:57:35+0000',
                'deleted': null,
                'parent_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization': [],
                'parent': null,
                '_links': {
                    'group_users': {
                        'label': 'Users in My Classes',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee15bf2-0288-11e6-8b6b-0800274f2cef/users'
                    }
                },
                'scope': 0
            },
            {
                'group_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
                'title': 'Ginas school',
                'description': null,
                'type': 'school',
                'meta': [],
                'head': 1,
                'tail': 6,
                'external_id': null,
                'created': '2016-05-31T20:25:09+0000',
                'updated': '2016-05-31T20:25:09+0000',
                'deleted': null,
                'parent_id': null,
                'organization': [],
                'parent': null,
                '_links': {
                    'group_users': {
                        'label': 'Users in My Schools',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee14a04-0288-11e6-8625-0800274f2cef/users'
                    }
                },
                'scope': 0
            }],
        'organizations': [{
            'org_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
            'title': 'Ginas Ink',
            'description': null,
            'type': 'district',
            'meta': [],
            'created': '2016-05-31T20:25:09+0000',
            'updated': '2016-05-31T20:25:09+0000',
            'deleted': null,
            '_links': {
                'org_users': {
                    'label': 'Users in My Districts',
                    'href': 'https://api-dev.changemyworldnow.com/org/9ee13654-0288-11e6-a70a-0800274f2cef/users'
                }
            }
        }]
    }
};

export default teacherData;
