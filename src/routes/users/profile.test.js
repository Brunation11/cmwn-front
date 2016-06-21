import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';
import { dataTransform } from 'routes/users/profile';
import MockFlipWrapper from 'mocks/users/MockFlipWrapper';
import GLOBALS from 'components/globals';

import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';

const COMING_SOON = 'Coming Soon!';


var checkProfileRender = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.instance()).to.be.instanceOf(Profile);
}

var checkOwnProfileContent = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.children('div')).to.have.length(1);
    expect(wrapper.find('Modal')).to.have.length(1);
    // TODO: how to test generate datasource
    // TODO: figure out testing among interconnected game wrapper, datasource, modal
    expect(wrapper.find('Trophycase')).to.have.length(1);
    expect(wrapper.find('FlipBoard')).to.have.length(1);
}

var checkAnotherProfileContent = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('.frame')).to.have.length(1);
    expect(wrapper.find('.user-metadata').children()).to.have.length(8);
    //TODO: test profile image when separated from mapStateToProps
}

describe('Profile', function() {
    //TODO: lifecycle methods when mounting set up with unconnected compoents

    describe('Teacher viewing own Profile', function() {
    
    	it('renders own teacher Profile', function() {
    	    checkProfileRender(teacherData, teacherData);
    	});

    	it('has all of the correct elements', function() {
    	    checkOwnProfileContent(teacherData, teacherData);
    	});
    });
    
    describe('Student viewing own Profile', function() {
       it('renders own student Profile', function() {
          checkProfileRender(studentDataA, studentDataA); 
       });
       
       it('has all of the correct elements', function() {
          checkOwnProfileContent(studentDataA, studentDataA); 
       });
        
    });
    
    describe('Teaching viewing student Profile', function() {
        it('renders student profile', function() {
            checkProfileRender(studentDataA, teacherData);
        });
        it ('has all of the correct elements', function() {
           checkAnotherProfileContent(studentDataA, teacherData);
        });
    });
    
    describe('Student viewing another student profile', function() {
        it('renders student profile', function() {
            checkProfileRender(studentDataB, studentDataA);
        });
        it ('has all of the correct elements', function() {
            checkAnotherProfileContent(studentDataB, studentDataA);
        });
    });
    
    describe('Student viewing teacher profile', function() {
        it('renders student profile', function() {
            checkProfileRender(teacherData, studentDataA);
        });
        
        it ('has all of the correct elements', function() {
            checkAnotherProfileContent(teacherData, studentDataA);
         });
    });
    
    describe('Null profile viewing', function() {
        it('renders null profile with null username', function() {
            var profile = <Profile data={{username: null}} loading={false} currentUser={studentDataA}/>;
            const wrapper = shallow(profile);
            expect(wrapper.type()).to.equal(null);
        });
    });
        
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
