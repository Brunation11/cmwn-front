var studentDataA = {
    'user_id': '81d58d4e-2844-11e6-a284-2dd9dce0dc3f',
    'username': 'calm-swan005',
    'email': 'calm-swan005@changemyworldnow.com',
    'first_name': 'FIRST16',
    'middle_name': null,
    'last_name': 'USER16',
    'gender': 'M',
    'birthdate': '2011-04-01 00:00:00',
    'created': '2016-06-01 22:02:18',
    'updated': '2016-06-03 17:53:46',
    'deleted': null,
    'type': 'CHILD',
    'external_id': '239274784',
    'token': '67259428315d048c6759ea9f41d4ab51-1a0138d3e2d1fa0d400016bf360c5bbb',
    '_links': {
        'self': {
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f'
        },
        'suggested_friends': {
            'label': 'Suggested Friends',
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/suggest'
        },
        'profile': {
            'label': 'Profile',
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f'
        },
        'user_image': {
            'label': 'Profile Image',
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/image'
        },
        'user_flip': {
            'label': 'My Earned Flips',
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/flip'
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
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/password'
        },
        'save_game': {
            'Label': 'Save Game',
            'templated': true,
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/game/{game_id}'
        },
        'user_name': {
            'label': 'Change User name',
            'href': 'https://api-dev.changemyworldnow.com/user-name'
        },
        'friend': {
            'label': 'My Friends',
            'href': 'https://api-dev.changemyworldnow.com/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/friend'
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
    'friend_status': 'CANT_FRIEND',
    '_embedded': {
        'groups': [
            {
                'group_id': '920e443c-2806-11e6-8d06-979856aee8e8',
                'organization_id': '5721abd4-2806-11e6-a057-da5d4d6df5e1',
                'title': '1-1',
                'description': null,
                'type': 'class',
                'meta': {
                    'sub_class_rooms': ['8001', '8004', '8005']
                },
                'head': 26,
                'tail': 27,
                'external_id': '101',
                'created': '2016-06-01T14:38:56+0000',
                'updated': '2016-06-01T14:39:05+0000',
                'deleted': null,
                'parent_id': '628553f4-2806-11e6-a477-b9c23aa27b57',
                'organization': [],
                'parent': null,
                '_links': {
                    'group_users': {
                        'label': 'Users in My Classes',
                        'href': 'https://api-dev.changemyworldnow.com/group/920e443c-2806-11e6-8d06-979856aee8e8/users'
                    }
                },
                'scope': 0
            },
            {
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
                'organization': [],
                'parent': null,
                '_links': {
                    'group_users': {
                        'label': 'Users in My Schools',
                        'href': 'https://api-dev.changemyworldnow.com/group/628553f4-2806-11e6-a477-b9c23aa27b57/users'
                    }
                },
                'scope': 0
            }],
        'organizations': [{
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
            'deleted': null,
            '_links': {
                'org_users': {
                    'label': 'Users in My Districts',
                    'href': 'https://api-dev.changemyworldnow.com/org/5721abd4-2806-11e6-a057-da5d4d6df5e1/users'
                }
            }
        }],
        'image': {
            'image_id': 'profiles/qnfocgblvg4mlpmfhesu',
            'url': 'https://res.cloudinary.com/changemyworldnow/image/upload/v1464976680/profiles/qnfocgblvg4mlpmfhesu.jpg',
            'is_moderated': true,
            'type': null,
            'created': '2016-06-03T17:58:03+0000',
            'updated': '2016-06-03T17:58:08+0000',
            'deleted': null,
            '_links': []
        }
    }
};

export default studentDataA;
