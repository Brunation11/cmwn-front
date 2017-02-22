/*global describe, it */

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

/*
describe('Application', function () {
    before('render and locate element', function () {
        //var renderedComponent = TestUtils.renderIntoDocument(
        //    <App />
        //);
        var renderedComponent = testComponentWithStore( <App /> );
        var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');

        this.appWrapper = inputComponent;
    });
    describe('Bootstrap', function () {
        it('Should insert React elements', function () {
            expect(TestUtils.isDOMComponent(this.appWrapper)).to.be.ok;
        });
    });
    describe('Routes', function () {
        it('Should load User Profile', function () {
            Store.dispatch({
                type: ACTION_CONSTANTS.MOCK_AUTH,
                data: {
                    username: 'test',
                    _embedded: {
                        'image': {url: ''}
                    }
                }
            });
            Store.dispatch({
                type: ACTION_CONSTANTS.MOCK_PAGE,
                data: {
                    data: {
                        username: 'test',
                        _links: {
                            'user_flip': {href: ''}
                        }
                    },
                }
            });
            var renderedComponent = testComponentWithStore( <Profile id="954d31ae-d689-11e5-bcaa-acbc32a6b1bb"/>);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, Profile._IDENTIFIER);
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        /*
        it('Should load User User List', function () {
            var renderedComponent = testComponentWithStore( <Users />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'user-list');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District List', function () {
            var renderedComponent = testComponentWithStore( <Districts />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'district-list');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit District', function () {
            var renderedComponent = testComponentWithStore( <DistrictEdit id="94cb922a-d689-11e5-ba76-acbc32a6b1bb" />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, DistrictEdit._IDENTIFIER);
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District Admin', function () {
            var renderedComponent = testComponentWithStore( <DistrictView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District Create', function () {
            var renderedComponent = testComponentWithStore( <DistrictCreate />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load School List', function () {
            var renderedComponent = testComponentWithStore( <Schools />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit School', function () {
            var renderedComponent = testComponentWithStore( <SchoolEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load School Profile', function () {
            var renderedComponent = testComponentWithStore( <SchoolProfile />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load School Admin', function () {
            var renderedComponent = testComponentWithStore( <SchoolView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Class List', function () {
            var renderedComponent = testComponentWithStore( <Classes />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit Class', function () {
            var renderedComponent = testComponentWithStore( <ClassEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Class Profile', function () {
            var renderedComponent = testComponentWithStore( <ClassProfile />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Class Admin', function () {
            var renderedComponent = testComponentWithStore( <ClassView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit Student', function () {
            var renderedComponent = testComponentWithStore( <StudentEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Friend List', function () {
            var renderedComponent = testComponentWithStore( <Friends />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Suggested Friends', function () {
            var renderedComponent = testComponentWithStore( <SuggestedFriends />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Single Game', function () {
            var renderedComponent = testComponentWithStore( <Game />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Forced Change Password', function () {
            var renderedComponent = testComponentWithStore( <ChangePassword />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        */
   /* });
});*/
