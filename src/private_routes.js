
import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import Organizations from 'routes/organizations';
import OrganizationView from 'routes/organizations/view';
import OrganizationEdit from 'routes/organizations/edit';
import Groups from 'routes/groups';
import GroupView from 'routes/groups/view';
import GroupEdit from 'routes/groups/edit';
import Friends from 'routes/friends';
import SuggestedFriends from 'routes/friends/suggested';
import Profile from 'routes/students/profile';
import StudentEdit from 'routes/students/edit';
import TeacherProfile from 'routes/teachers/profile';
import TeacherEdit from 'routes/teachers/edit';
import ParentProfile from 'routes/parents/profile';
import ParentEdit from 'routes/parents/edit';

var routes = [
    { path: 'users(/)', component: Users },
    { path: 'profile(/)', component: Profile},
    { path: 'profile/edit(/)', component: StudentEdit },
    { path: 'student/edit(/)', component: StudentEdit },
    { path: 'teacher/profile(/)', component: TeacherProfile },
    { path: 'teacher/edit(/)', component: TeacherEdit },
    { path: 'parent/profile(/)', component: ParentProfile },
    { path: 'parent/edit(/)', component: ParentEdit },
    { path: 'districts(/)', component: Districts},
    { path: 'district/:id(/)', component: DistrictView},
    { path: 'district/:id/view(/)', component: DistrictView},
    { path: 'district/:id/edit(/)', component: DistrictEdit},
    { path: 'organizations(/)', component: Organizations},
    { path: 'organization/:id(/)', component: OrganizationView},
    { path: 'organization/:id/view(/)', component: OrganizationView},
    { path: 'organization/:id/edit(/)', component: OrganizationEdit},
    { path: 'groups(/)', component: Groups},
    { path: 'group/:id(/)', component: GroupView},
    { path: 'group/:id/view(/)', component: GroupView},
    { path: 'group/:id/edit(/)', component: GroupEdit},
    { path: 'friends(/)', component: Friends},
    { path: 'friends/suggested(/)', component: SuggestedFriends}
];

export default routes;

