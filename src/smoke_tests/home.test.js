import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Home } from 'routes/home';
import { checkLayoutContents } from 'layouts/home.test.js';
import { checkHeaderContents } from 'components/header.test.js';


export default function() {
    describe('Anonymous user viewing homepage', function () {
        it('Renders homepage using mount', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.instance()).to.be.instanceOf(Home);
        });

        it('Has the correct home contents', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.find('#home')).to.have.lengthOf(1);
            expect(WRAPPER.children()).to.have.lengthOf(4);
            expect(WRAPPER.children('Modal')).to.have.lengthOf(1);
            expect(WRAPPER.children('.global-header')).to.have.lengthOf(1);
            expect(WRAPPER.children('Carousel')).to.have.lengthOf(1);
            expect(WRAPPER.children('.sweater')).to.have.lengthOf(1);
            expect(WRAPPER.find('Header').find('.actions')).to.have.lengthOf(1);
            expect(WRAPPER.find('.global-header').children()).to.have.lengthOf(3);
            expect(WRAPPER.find('CarouselItem')).to.have.lengthOf(3);
            expect(WRAPPER.find('.carousel-indicators li')).to.have.lengthOf(3);
            expect(WRAPPER.find('.carousel-inner .item')).to.have.lengthOf(3);
            expect(WRAPPER.find('#layout-sweater')).to.have.lengthOf(1);
            expect(WRAPPER.find('#layout-sweater').children()).to.have.lengthOf(1);
        });

        it('has the correct Layout contents', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            const LAYOUT = WRAPPER.find('Layout');
            checkLayoutContents(LAYOUT);
        });

        it('has the correct Header contentens', function() {
            const WRAPPER = mount(<Home currentUser={{}} />);
            const HEADER = WRAPPER.find('Header');
            checkHeaderContents(HEADER);
        });

        it('responds to clicking the header work modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('workOpen')).to.be.false;
            WRAPPER.find('#work-modal-link').simulate('click');
            expect(WRAPPER.state('workOpen')).to.be.true;
        });

        it('responds to clicking the header contact modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('contactOpen')).to.be.false;
            WRAPPER.find('#contact-modal-link').simulate('click');
            expect(WRAPPER.state('contactOpen')).to.be.true;
        });

        it('responds to clicking the footer work modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('workOpen')).to.be.false;
            WRAPPER.find('footer.links').children('a').at(0).simulate('click');
            expect(WRAPPER.state('workOpen')).to.be.true;
        });

        it('responds to clicking the footer contact modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('contactOpen')).to.be.false;
            WRAPPER.find('footer.links').children('a').at(1).simulate('click');
            expect(WRAPPER.state('contactOpen')).to.be.true;
        });

        it('responds to clicking school sign up link', function() {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('viewOpen')).to.be.false;
            WRAPPER.find('#video-btn').simulate('click');
            expect(WRAPPER.state('viewOpen')).to.be.true;
        });

        it('opens and closes the video', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('viewOpen')).to.be.false;
            // TODO: investigate opening video modal gives minified exception sometimes. LB 06/06/16
            //WRAPPER.find('#video-btn').simulate('click');
            //expect(WRAPPER.state('viewOpen')).to.be.true;
        });
    });
};
