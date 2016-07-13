import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import homeSmoke from 'smoke_tests/home.test.js';
import { Home } from 'routes/home';
import { COPY } from 'routes/home';
import { SOURCES } from 'routes/home';
import History from 'components/history';


describe('Home Page Smoke Tests', function () {
    homeSmoke();
});

describe('Home Page Unit Tests', function () {
    it('Renders homepage using mount', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        expect(WRAPPER.instance()).to.be.instanceOf(Home);
    });

    it('Has the correct home contents', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        expect(WRAPPER.find('#home')).to.have.lengthOf(1);
        expect(WRAPPER.children()).to.have.lengthOf(4);
        expect(WRAPPER.children('Modal')).to.have.lengthOf(1);
        expect(WRAPPER.children('.global-header')).to.have.lengthOf(1);
        expect(WRAPPER.children('Carousel')).to.have.lengthOf(1);
        expect(WRAPPER.children('.sweater')).to.have.lengthOf(1);
        expect(WRAPPER.find('Header')).to.have.lengthOf(1);
        expect(WRAPPER.find('.global-header').children()).to.have.lengthOf(3);
        expect(WRAPPER.find('CarouselItem')).to.have.lengthOf(3);
        expect(WRAPPER.find('#layout-sweater')).to.have.lengthOf(1);
        expect(WRAPPER.find('#layout-sweater').children()).to.have.lengthOf(1);
    });

    it('first slide has corrent content', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        const SLIDE = WRAPPER.find('CarouselItem').at(0);
        var header = typeof COPY.SLIDES[0].HEADING === 'string' ? COPY.SLIDES[0].HEADING :
            shallow(COPY.SLIDES[0].HEADING).text();
        expect(SLIDE.find('img').prop('src')).to.equal(SOURCES.SLIDEBG[0]);
        expect(SLIDE.find('h2').text()).to.equal(header);
    });

    it('second slide has corrent content', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        const SLIDE = WRAPPER.find('CarouselItem').at(1);
        var header = typeof COPY.SLIDES[1].HEADING === 'string' ? COPY.SLIDES[1].HEADING :
            shallow(COPY.SLIDES[1].HEADING).text();
        expect(SLIDE.find('img').prop('src')).to.equal(SOURCES.SLIDEBG[1]);
        expect(SLIDE.find('h2').text()).to.equal(header);
    });

    it('third slide has corrent content', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        const SLIDE = WRAPPER.find('CarouselItem').at(2);
        var header = typeof COPY.SLIDES[2].HEADING === 'string' ? COPY.SLIDES[2].HEADING :
            shallow(COPY.SLIDES[2].HEADING).text();
        expect(SLIDE.find('img').prop('src')).to.equal(SOURCES.SLIDEBG[2]);
        expect(SLIDE.find('h2').text()).to.equal(header);
    });

    it('responds properly to clicking logo as anonymous user', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        expect(History.getCurrentSize()).to.equal(1);
        expect(History.getCurrentLocation().pathname).to.equal('/home');
        WRAPPER.find('.logo-button').at(0).simulate('click');
        expect(History.getCurrentSize()).to.equal(1);
        expect(History.getCurrentLocation().pathname).to.equal('/home');
    });

    it('responds properly to clicking logo as logged in user', function () {
        const WRAPPER = shallow(<Home currentUser={{user_id: 'test'}} />);
        expect(History.getCurrentSize()).to.equal(1);
        expect(History.getCurrentLocation().pathname).to.equal('/home');
        WRAPPER.find('.logo-button').at(0).simulate('click');
        expect(History.getCurrentSize()).to.equal(1);
        expect(History.getCurrentLocation().pathname).to.equal('/profile');
    });

    it('opens and closes the video modal', function () {
        const WRAPPER = shallow(<Home currentUser={{}} />);
        expect(WRAPPER.state('viewOpen')).to.be.false;
        WRAPPER.find('#video-btn').simulate('click');
        expect(WRAPPER.state('viewOpen')).to.be.true;
        WRAPPER.find('#video-modal').simulate('hide');
        expect(WRAPPER.state('viewOpen')).to.be.false;
    });
});
