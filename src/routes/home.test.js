import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import {expect} from 'chai';

/*
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
 import Friends from 'routes/friends';
 import SuggestedFriends from 'routes/friends/suggested';
 import StudentEdit from 'routes/users/edit';
 import Game from 'routes/game';
 import ChangePassword from 'routes/change_password';
 */
//import ACTION_CONSTANTS from 'components/action_constants';

//import App from 'app';

/*
 var testComponentWithStore = function (component) {
 return TestUtils.renderIntoDocument(
 <Provider store={Store} >
 {component}
 </Provider>
 );
 };*/

window.__cmwn.MODE = 'test';

describe('Test Utilities', function () {
    describe('Mocha', function () {
        it('Tests are functioning.', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
    describe('Chai', function () {
        it('Chai syntax loads', function () {
            var foo = {foo: 'bar'};
            expect(foo).to.be.a('object');
            expect(foo.foo).to.equal('bar');
        });
    });
});