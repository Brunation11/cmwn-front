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
    { path: 'change-password(/)', component: ChangePassword },
    { path: 'users(/)', component: Users },
    { path: 'profile(/)', component: Profile},
    { path: 'games(/)', component: Profile},
    { path: 'game/:game(/)', component: Game},
    { path: 'profile/edit(/)', component: StudentEdit },
    { path: 'profile/:id/edit(/)', component: StudentEdit },
    { path: 'student/:id(/)', component: Profile},
    { path: 'student/edit(/)', component: StudentEdit },
    { path: 'student/:id/edit(/)', component: StudentEdit },
    { path: 'districts(/)', component: Districts},
    { path: 'district(/)', onEnter: redirect('/districts')},
    { path: 'district/create(/)', component: DistrictCreate},
    { path: 'district/:id(/)', component: DistrictView},
    { path: 'districts/:id(/)', onEnter: redirect('/district/:id')},
    { path: 'district/:id/view(/)', component: DistrictView},
    { path: 'districts/:id/view(/)', onEnter: redirect('/district/:id/view')},
    { path: 'district/:id/edit(/)', component: DistrictEdit},
    { path: 'districts:id/edit(/)', onEnter: redirect('/district/id:edit')},
    { path: 'organizations(/)', component: Organizations},
    { path: 'organization(/)', onEnter: redirect('/organizations')},
    { path: 'organization/:id(/)', component: OrganizationProfile},
    { path: 'organizations/:id(/)', onEnter: redirect('/organization/:id')},
    { path: 'organization/:id/view(/)', component: OrganizationView},
    { path: 'organizations/:id/view(/)', onEnter: redirect('/organization/:id/view')},
    { path: 'organization/:id/edit(/)', component: OrganizationEdit},
    { path: 'organizations/:id/edit(/)', onEnter: redirect('/organization/:id/edit')},
    { path: 'organization/:id/profile(/)', component: OrganizationProfile},
    { path: 'organizations/:id/profile(/)', onEnter: redirect('/organization/:id/profile')},
    { path: 'groups(/)', component: Groups},
    { path: 'group(/)', onEnter: redirect('/groups')},
    { path: 'group/:id(/)', component: GroupProfile},
    { path: 'groups/:id(/)', onEnter: redirect('/group/:id')},
    { path: 'group/:id/view(/)', component: GroupView},
    { path: 'groups/:id/view(/)', onEnter: redirect('/group/:id/view')},
    { path: 'group/:id/edit(/)', component: GroupEdit},
    { path: 'groups/:id/edit(/)', onEnter: redirect('/group/:id/edit')},
    { path: 'group/:id/profile(/)', component: GroupProfile},
    { path: 'groups/:id/profile(/)', onEnter: redirect('/group/:id/profile')},
    { path: 'friends(/)', component: Friends},
    { path: 'friends/suggested(/)', component: SuggestedFriends},
    { path: 'suggestedfriends(/)', onEnter: redirect('/friends/suggested')}
];

export default routes;

