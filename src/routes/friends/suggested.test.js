import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Suggested } from 'routes/friends/suggested';

import studentDataB from 'mocks/users/student_data_b';

describe('test <Suggested /> component', function (){
    var suggested = <Suggested data={studentDataB}/>;
    const WRAPPER = shallow(suggested);
    it('checks that WRAPPER is an instance of Suggested', function (){
        expect(WRAPPER.instance()).to.be.instanceOf(Suggested);
    }); 
    
    it('checks that all elements are present', function (){
        expect(WRAPPER.find('Layout')).to.have.length(1);
        expect(WRAPPER.find('form')).to.have.length(1);
    });
});

describe('renders null suggested friends', function (){
    var suggested = <Suggested />;
    const WRAPPER = shallow(suggested);
    it('checks that if data is null render returns null', function (){
        expect(WRAPPER.children()).to.have.length(0);
    });
});
