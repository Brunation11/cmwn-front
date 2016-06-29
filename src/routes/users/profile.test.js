import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';
import { dataTransform } from 'routes/users/profile';
import MockFlipWrapper from 'mocks/MockFlipWrapper';
import GLOBALS from 'components/globals';
import profileSmoke from 'smoke_tests/users/profile.test.js'

import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';

const COMING_SOON = 'Coming Soon!';

describe('Profile', function() {
    // TODO: lifecycle methods when mounting set up with unconnected components.  LB 06/21/16.
    // TODO: also use mount to test interactions with other components like generate data source & profile image. LB 06/22/16
    // TODO: test show modal when set up mock Detector and History set up. LB 06/22/16

    profileSmoke();
    
    describe('render a flip', function() {
        var item = {
            coming_soon: false,
            game_id: 0,
            title: 'test game',
            description: 'a mock game to test flip'
        };
        
        it('renders a flip', function() {
           const wrapper = shallow(<MockFlipWrapper item={item}/>); 
           expect(wrapper.instance()).to.be.instanceOf(MockFlipWrapper);
        });
        
        it('has flip contents', function() {
            const wrapper = shallow(<MockFlipWrapper item={item}/>); 
            expect(wrapper.children()).to.have.length(1);
            expect(wrapper.find('a')).to.have.length(1);
            expect(wrapper.find('.coming-soon')).to.have.length(1);
            expect(wrapper.find('img')).to.have.length(1);
        });
        
        
        it('responds to click', function() {
            const wrapper = mount(<MockFlipWrapper item={item}/>); 
            expect(wrapper.prop('clicked')).to.equal(null);
            wrapper.find('a').simulate('click');
            expect(wrapper.prop('clicked')).to.equal(GLOBALS.GAME_URL + '0/index.html');
        });
            
        it('renders for coming soon', function() {
            item.coming_soon = true;
            const wrapper = mount(<MockFlipWrapper item={item}/>); 
            expect(wrapper.find('.play').text()).to.equal(COMING_SOON);
            expect(wrapper.prop('clicked')).to.equal(null);
            wrapper.find('a').simulate('click');
            expect(wrapper.prop('clicked')).to.equal(null);
        });
            
    });
    
    describe('data transform method for game wrapper', function() {
       it('handles null input', function() {
           expect(dataTransform(null)).to.be.an.instanceof(Array).and.to.be.empty;
       });
       
       it('handles empty list', function() {
           expect(dataTransform([])).to.be.an.instanceof(Array).and.to.be.empty;
       });
       
       it('handles non array', function() {
           expect(dataTransform({})).to.be.an.instanceof(Array).and.to.be.empty;
       })

       it('handles one element', function() {
           var data = [{id: 0, coming_soon: false}];
           var result = dataTransform(data);
           expect(result).to.be.an.instanceof(Array);
           expect(result).to.have.lengthOf(1);
       });
       
       it('handles even number of elements', function() {
           var data = [
               {id: 0, coming_soon: false}, 
               {id: 1, coming_soon: false}, 
               {id: 2, coming_soon: false},
               {id: 3, coming_soon: false}
           ];
           var result = dataTransform(data);

           expect(result).to.be.an.instanceof(Array);
           expect(result).to.have.lengthOf(4);           
       });
        
       it('handles odd number of elements', function() {
           var data = [
               {id: 0, coming_soon: false}, 
               {id: 1, coming_soon: false}, 
               {id: 2, coming_soon: false},
               {id: 3, coming_soon: false},
               {id: 4, coming_soon: false}
           ];
           
           var result = dataTransform(data);

           expect(result).to.be.an.instanceof(Array);
           expect(result).to.have.lengthOf(5);   
       });
       
       it('handles separating coming soon', function() {
           var data = [
               {id: 0, coming_soon: false}, 
               {id: 1, coming_soon: false}, 
               {id: 2, coming_soon: true},
               {id: 3, coming_soon: false},
               {id: 4, coming_soon: false}
           ];
           
           var result = dataTransform(data);
           expect(result).to.be.an.instanceof(Array)
           expect(result).to.have.lengthOf(5);
           expect(result[4].id).to.equal(2); 
        });

    });
    
});
