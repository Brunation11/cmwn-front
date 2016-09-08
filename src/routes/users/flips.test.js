import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { FlipWall } from 'routes/users/flips';
import GLOBALS from 'components/globals';
import FlipWallSmoke from 'smoke_tests/users/flips.test.js';
import studentDataA from 'mocks/users/student_data_a';
import flipsData from 'mocks/users/flips_data';

var checkFlipWallRender = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(flipWall);
    expect(WRAPPER.instance()).to.be.instanceOf(FlipWall);
};

var checkFlipWallContent = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(flipWall);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
};

describe('Flip Wall Smoke Tests', function () {
    FlipWallSmoke();
});

describe('Flip Wall Unit Tests', function () {

    describe('Student viewing own Flip Wall', function () {
        it('renders own student Flip Wall', function () {
            checkFlipWallRender(flipsData, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkFlipWallContent(flipsData, studentDataA);
        });

    });

    // describe('render a flip', function () {
    //     var item = { // import a mock flip as data
    //         // coming_soon: false, // eslint-disable-line camelcase
    //         // game_id: 0, // eslint-disable-line camelcase
    //         // title: 'test game',
    //         // description: 'a mock game to test flip'
    //     };

    //     it('renders a flip', function () {
    //         const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
    //         expect(WRAPPER.instance()).to.be.instanceOf(MockFlipWrapper);
    //     });

    //     it('has flip contents', function () {
    //         const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
    //         expect(WRAPPER.children()).to.have.length(1);
    //         expect(WRAPPER.find('a')).to.have.length(1);
    //         expect(WRAPPER.find('.coming-soon')).to.have.length(1);
    //         expect(WRAPPER.find('img')).to.have.length(1);
    //     });


    //     it('responds to click', function () {
    //         const WRAPPER = mount(<MockFlipWrapper item={item}/>);
    //         expect(WRAPPER.prop('clicked')).to.equal(null);
    //         WRAPPER.find('a').simulate('click');
    //         expect(WRAPPER.prop('clicked')).to.equal(GLOBALS.GAME_URL + '0/index.html');
    //     });

    //     it('renders for coming soon', function () {
    //         item.coming_soon = true; // eslint-disable-line camelcase
    //         const WRAPPER = mount(<MockFlipWrapper item={item}/>);
    //         expect(WRAPPER.find('.play').text()).to.equal(COMING_SOON);
    //         expect(WRAPPER.prop('clicked')).to.equal(null);
    //         WRAPPER.find('a').simulate('click');
    //         expect(WRAPPER.prop('clicked')).to.equal(null);
    //     });
    // });

    // /* eslint-disable camelcase */
    // describe('data transform method for game wrapper', function () {
    //     it('handles null input', function () {
    //         expect(dataTransform(null)).to.be.an.instanceof(Array).and.to.be.empty;
    //     });

    //     it('handles undefined input', function () {
    //         expect(dataTransform(null)).to.be.an.instanceof(Array).and.to.be.empty;
    //     });

    //     it('handles empty list', function () {
    //         expect(dataTransform([])).to.be.an.instanceof(Array).and.to.be.empty;
    //     });

    //     it('handles non array', function () {
    //         expect(dataTransform({})).to.be.an.instanceof(Array).and.to.be.empty;
    //     });

    //     it('handles nonsense', function () {
    //         expect(dataTransform('cat dog!!!!')).to.be.an.instanceof(Array).and.to.be.empty;
    //     });

    //     it('handles one element', function () {
    //         var data = [{id: 0, coming_soon: false}];
    //         var result = dataTransform(data);
    //         expect(result).to.be.an.instanceof(Array);
    //         expect(result).to.have.lengthOf(1);
    //     });

    //     it('handles even number of elements', function () {
    //         var data = [
    //             {id: 0, coming_soon: false},
    //             {id: 1, coming_soon: false},
    //             {id: 2, coming_soon: false},
    //             {id: 3, coming_soon: false}
    //         ];
    //         var result = dataTransform(data);

    //         expect(result).to.be.an.instanceof(Array);
    //         expect(result).to.have.lengthOf(4);
    //     });

    //     it('handles odd number of elements', function () {
    //         var data = [
    //             {id: 0, coming_soon: false},
    //             {id: 1, coming_soon: false},
    //             {id: 2, coming_soon: false},
    //             {id: 3, coming_soon: false},
    //             {id: 4, coming_soon: false}
    //         ];

    //         var result = dataTransform(data);

    //         expect(result).to.be.an.instanceof(Array);
    //         expect(result).to.have.lengthOf(5);
    //     });

    //     it('handles separating coming soon', function () {
    //         var data = [
    //             {id: 0, coming_soon: false},
    //             {id: 1, coming_soon: false},
    //             {id: 2, coming_soon: true},
    //             {id: 3, coming_soon: false},
    //             {id: 4, coming_soon: false}
    //         ];

    //         var result = dataTransform(data);
    //         expect(result).to.be.an.instanceof(Array);
    //         expect(result).to.have.lengthOf(5);
    //         expect(result[4].id).to.equal(2);
    //     });

    // });
    /* eslint-enable camelcase */
});
