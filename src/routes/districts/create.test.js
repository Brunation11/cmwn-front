import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { CreateDistrict } from 'routes/districts/create';

var create = <CreateDistrict />;
const WRAPPER = shallow(create);

describe('creating district', function (){
    it('checks that all elements appear', function (){
        expect(WRAPPER.find('Layout')).to.have.length(1);
        expect(WRAPPER.find('Form')).to.have.length(1);
        expect(WRAPPER.find('Input')).to.have.length(3);
        expect(WRAPPER.find('Button')).to.have.length(1);
    });
});
