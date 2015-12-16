import Home from 'routes/home';
import Logout from 'routes/logout';
import Login from 'routes/login';

import logout from 'routes/logout.scss';

var routes = [
    { path: 'home(/)', component: Home},
    { path: 'logout(/)', component: Logout },
    { path: 'login(/)', component: Login}
];

export default routes;

