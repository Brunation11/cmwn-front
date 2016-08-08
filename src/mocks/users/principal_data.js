/* eslint-disable max-len */

var principalData = {
    'user_id': 'c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c',
    'username': 'principal',
    'email': 'principal@ginasink.com',
    'first_name': 'Gina',
    'middle_name': null,
    'last_name': 'Principal',
    'gender': 'male',
    'birthdate': null,
    'meta': [],
    'created': '2016-05-31 20:25:09',
    'updated': '2016-05-31 20:25:09',
    'deleted': null,
    'type': 'ADULT',
    'external_id': null,
    'token': '13de62cd8a9752e2af9baf443e9cac33-e76dd6bcc2032f87b11abe6ed1c74a81',
    '_links': {
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c'
        },
        'profile': {
            'label': 'Profile',
            'href': 'https://api-dev.changemyworldnow.com/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c'
        },
        'user_image': {
            'label': 'Profile Image',
            'href': 'https://api-dev.changemyworldnow.com/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c/image'
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
            'href': 'https://api-dev.changemyworldnow.com/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c/password'
        },
        'save_game': {
            'Label': 'Save Game',
            'templated': true,
            'href': 'https://api-dev.changemyworldnow.com/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c/game/{game_id}'
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
                'updated': '2016-07-12T21:23:50+0000',
                'deleted': null,
                'parent_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization': [],
                'parent': null,
                '_links': {
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
            },
            {
                'group_id': '9ee14a04-0288-11e6-8625-0800274f2cef',
                'organization_id': '9ee13654-0288-11e6-a70a-0800274f2cef',
                'title': 'Ginas school',
                'description': 'description',
                'type': 'school',
                'meta': null,
                'head': 1,
                'tail': 6,
                'external_id': null,
                'created': '2016-05-31T20:25:09+0000',
                'updated': '2016-07-12T21:23:30+0000',
                'deleted': null,
                'parent_id': null,
                'organization': [],
                'parent': null,
                '_links': {
                    'group_users': {
                        'label': 'Users in My Schools',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee14a04-0288-11e6-8625-0800274f2cef/users'
                    },
                    'import': {
                        'label': 'Import Users',
                        'href': 'https://api-dev.changemyworldnow.com/group/9ee14a04-0288-11e6-8625-0800274f2cef/import'
                    }
                },
                'scope': 0
            }
        ],
        'organizations': [
            {
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
            }
        ]
    }
};

export default principalData;
