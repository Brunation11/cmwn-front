import _ from 'lodash';

import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import DistrictCreate from 'routes/districts/create';
import Organizations from 'routes/organizations';
import OrganizationView from 'routes/organizations/view';
import OrganizationEdit from 'routes/organizations/edit';
import OrganizationProfile from 'routes/organizations/profile';
import Groups from 'routes/groups';
import GroupView from 'routes/groups/view';
import GroupEdit from 'routes/groups/edit';
import GroupProfile from 'routes/groups/profile';
import Friends from 'routes/friends';
import SuggestedFriends from 'routes/friends/suggested';
import Profile from 'routes/users/profile';
import StudentEdit from 'routes/users/edit';
import Game from 'routes/game';
import ChangePassword from 'routes/change_password';

var redirect = function (path) {
    return function (nextState, transition) {
        _.each(nextState.params, (v, k) => {
            path = path.replace(`:${k}`, v);
        });

        transition(null, path);
    };
};

var routes = [
    { path: 'auth/logout(/)', onEnter: redirect('/logout')},
    { path: 'change-password(/)', title: 'Password Change', component: ChangePassword },
    { path: 'users(/)', title: 'Users', endpoint: '/users', component: Users },
    { path: 'profile(/)', title: 'Profile', endpoint: '$$me', component: Profile},
    { path: 'games(/)', title: 'Games', endpoint: '/game', component: Profile},
    { path: 'game/:game(/)', title: 'Games', endpoint: '/game/:game', component: Game},
    { path: 'profile/edit(/)', title: 'Edit Profile', endpoint: '$$me', component: StudentEdit },
    { path: 'profile/:id/edit(/)', title: 'Edit Profile', endpoint: '/user/:id', component: StudentEdit },
    { path: 'user(/)', onEnter: redirect('/profile')},
    { path: 'users(/)', onEnter: redirect('/profile')},
    { path: 'user/:id(/)', onEnter: redirect('/profile/:id')},
    { path: 'users/:id(/)', onEnter: redirect('/profile/:id')},
    { path: 'user/:id/edit(/)', onEnter: redirect('/profile/:id/edit')},
    { path: 'users/:id/edit(/)', onEnter: redirect('/profile/:id/edit')},
    { path: 'student/:id(/)', title: 'Profile', endpoint: 'user/:id', component: Profile},
    { path: 'student/edit(/)', title: 'Edit Student', endpoint: '$$me', component: StudentEdit },
    { path: 'student/:id/edit(/)', title: 'Edit Student', endpoint: '/user/:id', component: StudentEdit },
    { path: 'districts(/)', title: 'Districts', endpoint: '/org', component: Districts},
    { path: 'district(/)', onEnter: redirect('/districts')},
    { path: 'district/create(/)', title: 'Create District', endpoint: '/org', component: DistrictCreate},
    { path: 'district/:id(/)', title: 'District', endpoint: '/org/:id', component: DistrictView},
    { path: 'districts/:id(/)', onEnter: redirect('/district/:id')},
    { path: 'district/:id/view(/)', title: 'District', endpoint: '/org/:id', component: DistrictView},
    { path: 'districts/:id/view(/)', onEnter: redirect('/district/:id/view')},
    { path: 'district/:id/edit(/)', title: 'Edit District', endpoint: '/org/:id', component: DistrictEdit},
    { path: 'districts:id/edit(/)', onEnter: redirect('/district/id:edit')},
    { path: 'organizations(/)', title: 'Organization', endpoint: '/group', component: Organizations},
    { path: 'organization(/)', onEnter: redirect('/organizations')},
    { path: 'organization/:id(/)', title: 'Organization', endpoint: '/group/:id', component: OrganizationProfile},
    { path: 'organizations/:id(/)', onEnter: redirect('/organization/:id')},
    { path: 'organization/:id/view(/)', title: 'Organization', endpoint: '/group/:id', component: OrganizationView},
    { path: 'organizations/:id/view(/)', onEnter: redirect('/organization/:id/view')},
    { path: 'organization/:id/edit(/)', title: 'Edit Organization', endpoint: '/group/:id', component: OrganizationEdit},
    { path: 'organizations/:id/edit(/)', onEnter: redirect('/organization/:id/edit')},
    { path: 'organization/:id/profile(/)', title: 'Organization', endpoint: '/group/:id', component: OrganizationProfile},
    { path: 'organizations/:id/profile(/)', onEnter: redirect('/organization/:id/profile')},
    { path: 'groups(/)', title: 'Groups', endpoint: '/group', component: Groups},
    { path: 'group(/)', onEnter: redirect('/groups')},
    { path: 'group/:id(/)', title: 'Groups', endpoint: '/group/:id', component: GroupProfile},
    { path: 'groups/:id(/)', onEnter: redirect('/group/:id')},
    { path: 'group/:id/view(/)', title: 'Groups', endpoint: '/group/:id', component: GroupView},
    { path: 'groups/:id/view(/)', onEnter: redirect('/group/:id/view')},
    { path: 'group/:id/edit(/)', title: 'Edit Groups', endpoint: '/group/:id', component: GroupEdit},
    { path: 'groups/:id/edit(/)', onEnter: redirect('/group/:id/edit')},
    { path: 'group/:id/profile(/)', title: 'Groups', endpoint: '/group/:id', component: GroupProfile},
    { path: 'groups/:id/profile(/)', onEnter: redirect('/group/:id/profile')},
    { path: 'friends(/)', title: 'Friends', endpoint: '/friend', component: Friends},
    { path: 'friends/suggested(/)', title: 'Suggested Friends', endpoint: '/friend', component: SuggestedFriends},
    { path: 'suggestedfriends(/)', onEnter: redirect('/friends/suggested')}
];

routes = _.map(routes, i => {
    //defaults
    i.title = i.title || 'Change My World Now';
    return i;
});

export default routes;

