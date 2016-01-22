import _ from 'lodash';

import Home from 'routes/home';
import Logout from 'routes/logout';
import Login from 'routes/login';
import Signup from 'routes/teachers/signup';

import 'routes/logout.scss';

var redirect = function (path) {
    return function (nextState, transition) {
        _.each(nextState.params, (v, k) => {
            path = path.replace(`:${k}`, v);
        });

        transition(null, path);
    };
};

var routes = [
    { path: 'home(/)', component: Home},
    { path: 'grown-ups/partnerships-media/ginas-ink(/)', onEnter: redirect('/')},
    { path: 'teachers/signup(/)', component: Signup },
    { path: 'logout(/)', component: Logout },
    { path: 'login(/)', component: Login}
];

routes.hasPath = function (path) {
    path = path[0] === '/' ? path.slice(1) : path;
    return _.reduce(routes, (a, v) => {
        return a || v.path.indexOf(path) === 0;
    }, false);
};

export default routes;

