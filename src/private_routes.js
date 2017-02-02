/* eslint-disable no-unused-vars, max-len */
import _ from 'lodash';

import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import DistrictCreate from 'routes/districts/create';
import Schools from 'routes/schools';
import SchoolView from 'routes/schools/view';
import SchoolEdit from 'routes/schools/edit';
import SchoolProfile from 'routes/schools/profile';
import Classes from 'routes/classes';
import ClassView from 'routes/classes/view';
import ClassEdit from 'routes/classes/edit';
import ClassProfile from 'routes/classes/profile';
import UserCards from 'routes/classes/user_cards';
import Friends from 'routes/friends';
import SuggestedFriends from 'routes/friends/suggested';
import Profile from 'routes/users/profile';
import StudentEdit from 'routes/users/edit';
import UserAdmin from 'routes/users/view';
import Game from 'routes/game';
import Play from 'routes/play';
import Games from 'routes/games';
import ChangePassword from 'routes/change_password';
import NewsFeed from 'routes/newsfeed';
import Flips from 'routes/users/flips';
import GodModeHome from 'routes/god_mode';
import EditUser from 'routes/god_mode/users/edit_user';
import ManageUsers from 'routes/god_mode/users/manage_users';
import CreateUser from 'routes/god_mode/users/create_user';
import ResourceCenter from 'routes/resource_center';
import FlagView from 'routes/flags';
import AAYView from 'routes/aay_survey';
import Help from 'routes/help';
import GodModeGames from 'routes/god_mode/games';
import ManageGroups from 'routes/god_mode/groups/manage_groups';
import EditGroup from 'routes/god_mode/groups/edit_group';
import CreateGroup from 'routes/god_mode/groups/create_group';
import ManageOrgs from 'routes/god_mode/orgs/manage_orgs';
import CreateOrg from 'routes/god_mode/orgs/create_org';
import EditOrg from 'routes/god_mode/orgs/edit_org';
import ManageFlips from 'routes/god_mode/flips';

var redirect = function (path) {
    return function (nextState, transition) {
        var nextPath = path;
        _.each(nextState.params, (v, k) => {
            nextPath = nextPath.replace(`:${k}`, v);
        });

        transition(null, nextPath);
    };
};

var routes = [
    { path: 'auth/logout(/)', onEnter: redirect('/logout')},
    { path: 'change-password(/)', title: 'Password Change', component: ChangePassword },
    { path: 'profile(/)', title: 'Profile', endpoint: '$$self', component: Profile},
    { path: 'games(/)', title: 'Games', component: Games},
    { path: 'game/:game(/)', title: 'Games', endpoint: '$$self', component: Game},
    { path: 'play/:game(/)', title: 'Games', endpoint: '$$self', component: Play},
    { path: 'profile/edit(/)', title: 'Edit Profile', endpoint: '$$self', component: StudentEdit },
    { path: 'profile/:id/edit(/)', title: 'Edit Profile', endpoint: '/user/:id', component: StudentEdit },
    { path: 'profile/view(/)', title: 'User Admin', endpoint: '$$self', component: UserAdmin },
    { path: 'profile/:id/view(/)', title: 'User Admin', endpoint: '/user/:id', component: UserAdmin },
    { path: 'users(/)', title: 'Users', endpoint: '$$user', component: Users },
    { path: 'user(/)', onEnter: redirect('/profile')},
    { path: 'user/:id(/)', onEnter: redirect('/profile/:id')},
    { path: 'users/:id(/)', onEnter: redirect('/profile/:id')},
    { path: 'user/:id/view(/)', onEnter: redirect('/profile/:id/view') },
    { path: 'users/:id/view(/)', onEnter: redirect('/profile/:id/view') },
    { path: 'user/:id/edit(/)', onEnter: redirect('/profile/:id/edit')},
    { path: 'users/:id/edit(/)', onEnter: redirect('/profile/:id/edit')},
    { path: '/trophycase(/)', title: 'Flips', endpoint: '/flip', component: Flips},
    //{ path: 'user/:id/trophycase(/)', title: 'My Earned Flips', endpoint: '/user/:id/flip', component: Flips},
    { path: 'student/:id(/)', title: 'Profile', endpoint: 'user/:id', component: Profile},
    { path: 'profile/:id(/)', title: 'Profile', endpoint: 'user/:id', component: Profile},
    { path: 'student/edit(/)', title: 'Edit Student', endpoint: '$$me', component: StudentEdit },
    { path: 'student/:id/edit(/)', title: 'Edit Student', endpoint: '/user/:id', component: StudentEdit },
    { path: 'districts(/)', title: 'Districts', endpoint: '/org?type=district', component: Districts},
    { path: 'district(/)', onEnter: redirect('/districts')},
    { path: 'district/create(/)', title: 'Create District', endpoint: '/org', component: DistrictCreate},
    { path: 'district/:id(/)', title: 'District', endpoint: '/org/:id', component: DistrictView},
    { path: 'districts/:id(/)', onEnter: redirect('/district/:id')},
    { path: 'district/:id/view(/)', title: 'District', endpoint: '/org/:id', component: DistrictView},
    { path: 'districts/:id/view(/)', onEnter: redirect('/district/:id/view')},
    { path: 'district/:id/edit(/)', title: 'Edit District', endpoint: '/org/:id', component: DistrictEdit},
    { path: 'districts:id/edit(/)', onEnter: redirect('/district/:id/edit')},
    { path: 'schools(/)', title: 'School', endpoint: '/group?type=school', component: Schools},
    { path: 'school(/)', onEnter: redirect('/schools')},
    { path: 'school/:id(/)', title: 'School', endpoint: '/group/:id', component: SchoolProfile},
    { path: 'schools/:id(/)', onEnter: redirect('/school/:id')},
    { path: 'school/:id/view(/)', title: 'School', endpoint: '/group/:id', component: SchoolView},
    { path: 'schools/:id/view(/)', onEnter: redirect('/school/:id/view')},
    { path: 'school/:id/edit(/)', title: 'Edit School', endpoint: '/group/:id', component: SchoolEdit},
    { path: 'schools/:id/edit(/)', onEnter: redirect('/school/:id/edit')},
    { path: 'school/:id/profile(/)', title: 'School', endpoint: '/group/:id', component: SchoolProfile},
    { path: 'schools/:id/profile(/)', onEnter: redirect('/school/:id/profile')},
    { path: 'classes(/)', title: 'Classes', endpoint: '/group?type=class', component: Classes},
    { path: 'class(/)', onEnter: redirect('/classes')},
    { path: 'class/:id(/)', title: 'Classes', endpoint: '/group/:id', component: ClassProfile},
    { path: 'classes/:id(/)', onEnter: redirect('/class/:id')},
    { path: 'class/:id/view(/)', title: 'Classes', endpoint: '/group/:id', component: ClassView},
    { path: 'class/:id/cards(/)', title: 'User Cards', endpoint: '/group/:id', component: UserCards},
    { path: 'classes/:id/view(/)', onEnter: redirect('/class/:id/view')},
    { path: 'class/:id/edit(/)', title: 'Edit Classes', endpoint: '/group/:id', component: ClassEdit},
    { path: 'classes/:id/edit(/)', onEnter: redirect('/class/:id/edit')},
    { path: 'class/:id/profile(/)', title: 'Classes', endpoint: '/group/:id', component: ClassProfile},
    { path: 'classes/:id/profile(/)', onEnter: redirect('/class/:id/profile')},
    { path: 'friends(/)', title: 'Friends', endpoint: '$$friend', component: Friends},
    { path: 'friends/suggested(/)', title: 'Suggested Friends', endpoint: '$$suggested_friends',
        component: SuggestedFriends},
    { path: 'suggestedfriends(/)', onEnter: redirect('/friends/suggested')},
    { path: '/flaggedimages(/)', title: 'Flagged Images', endpoint: '/flag', component: FlagView},
    { path: 'sa/game-data/:id', title: 'AAY Data', endpoint: '/game-data/:id', component: AAYView},
    { path: 'sa(/)', title: 'God Mode', endpoint: '/sa/settings', component: GodModeHome},
    { path: 'sa/users(/)', title: 'Manage Users', endpoint: '$$user', component: ManageUsers},
    { path: 'sa/user/:id/edit(/)', title: 'Edit User', endpoint: '/user/:id', component: EditUser},
    { path: 'sa/user/create(/)', title: 'Create User', component: CreateUser},
    { path: 'sa/game-data/:id', title: 'AAY Data', endpoint: '/game-data/:id', component: AAYView},
    { path: 'sa/games(/)', title: 'Manage Games', endpoint: '$$games', component: GodModeGames},
    { path: 'resources(/)', component: ResourceCenter, endpoint: ''},
    { path: 'user/:id/feed(/)', title: 'News Feed', endpoint: '/user/:id/feed', component: NewsFeed},
    { path: 'help(/)', title: 'Help', component: Help},
    { path: '/flaggedimages(/)', title: 'Flagged Images', endpoint: '/flag', component: FlagView},
    { path: 'all-about-you(/)', title: 'AAY Data', endpoint: '/game-data/all-about-you', component: AAYView},
    { path: 'sa/games(/)', title: 'Manage Games', endpoint: '$$games', component: GodModeGames},
    { path: 'sa/groups(/)', title: 'Manage Groups', endpoint: '/group', component: ManageGroups},
    { path: 'sa/group/create(/)', title: 'Create Group', component: CreateGroup},
    { path: 'sa/group/:id/edit(/)', title: 'Edit Group', endpoint: '/group/:id', component: EditGroup},
    { path: 'sa/orgs(/)', title: 'Manage Organizations', endpoint: '/org', component: ManageOrgs},
    { path: 'sa/org/create(/)', title: 'Create Organization', component: CreateOrg},
    { path: 'sa/org/:id/edit(/)', title: 'Edit Organization', endpoint: '/org/:id', component: EditOrg},
    { path: 'sa/flips(/)', title: 'Manage Flips', endpoint: '/flip', component: ManageFlips},
];

routes = _.map(routes, i => {
    //defaults
    i.title = i.title || 'Change My World Now';
    return i;
});

export default routes;

