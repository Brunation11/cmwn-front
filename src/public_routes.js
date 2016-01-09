import Home from 'routes/home';
import Logout from 'routes/logout';
import Login from 'routes/login';
import Signup from 'routes/teachers/signup';

import 'routes/logout.scss';

var routes = [
    { path: 'home(/)', component: Home},
    { path: 'teachers/signup(/)', component: Signup },
    { path: 'logout(/)', component: Logout },
    { path: 'login(/)', component: Login}
];

export default routes;

