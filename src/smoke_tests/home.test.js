import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Home } from 'routes/home';

export default function() {
    describe('Anonymous user viewing homepage', function () {
        it('Renders homepage using mount', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.instance()).to.be.instanceOf(Home);
        });

        it('Has the correct home contents', function() {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.children()).to.have.lengthOf(1);
            expect(WRAPPER.children('.layout')).to.have.lengthOf(1);
            //expect(WRAPPER.find('.layout')).children('content').to.have.lengthOf(1);
            //expect(WRAPPER.find('.content-group .message')).to.have.lengthOf(1)
        });
    });
};
