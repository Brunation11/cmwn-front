import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Suggested } from 'routes/friends/suggested';
import MockFlipWrapper from 'mocks/mock_flip_wrapper';

import studentDataB from 'mocks/users/student_data_b';

describe('test <Suggested /> component', function (){
    var suggested = <Suggested data={[studentDataB]}/>;
    const WRAPPER = shallow(suggested);
    it('checks that WRAPPER is an instance of Suggested', function (){
        expect(WRAPPER.instance()).to.be.instanceOf(Suggested);
    }); 
    
    it('checks that all elements are present', function (){
        expect(WRAPPER.find('Layout')).to.have.length(1);
    });
});

describe('renders null suggested friends', function (){
    var suggested = <Suggested />;
    const WRAPPER = shallow(suggested);
    it('checks that if data is null render returns null', function (){
        expect(WRAPPER.children()).to.have.length(0);
    });
    it('checks that the layout still loads', function (){
        expect(WRAPPER.find('Layout')).to.have.length(1);
    });
});

describe('renders empty suggested friends', function (){
    var suggested = <Suggested data={[]} />;
    const WRAPPER = shallow(suggested);
    it('checks that a message is displayed when no suggested friends are present', function () {
        expect(WRAPPER.find('h2')).to.have.length(1);
    });
});

describe('test rendering a flip', function (){
    var item = {
        coming_soon: false, // eslint-disable-line camelcase
        game_id: 0, // eslint-disable-line camelcase
        title: 'test game',
        description: 'a mock game to test flip'
    };

    it('renders a flip', function () {
        const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
        expect(WRAPPER.instance()).to.be.instanceOf(MockFlipWrapper);
    });

    it('check flip elements', function () {
        const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
        expect(WRAPPER.children()).to.have.length(1);
        expect(WRAPPER.find('.item')).to.have.length(1);
        expect(WRAPPER.find('.overlay')).to.have.length(1);
        expect(WRAPPER.find('img')).to.have.length(1);
    });
});

