import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Home } from 'routes/home';
import { checkLayoutContents } from 'layouts/home.test.js';

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
            // TODO: weird iframe behavior?
            //expect(WRAPPER.find('#viddler-b9cd1cb6')).to.have.lengthOf(1);
            //expect(WRAPPER.find('iframe')).to.be.ok;
            expect(WRAPPER.find('.global-header').children()).to.have.lengthOf(3);
            //expect(WRAPPER.find('Carousel').children()).to.have.lengthOf(3);
            //expect(WRAPPER.find('.sweater').children()).to.have.lengthOf(1);

            //expect(WRAPPER.find('.layout')).children('content').to.have.lengthOf(1);
            //expect(WRAPPER.find('.content-group .message')).to.have.lengthOf(1)
        });

        it('has the correct Layout contents', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            const LAYOUT = WRAPPER.find('Layout');
            checkLayoutContents(LAYOUT);
        });

        it('responds to clicking the work modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('workOpen')).to.be.false;
            WRAPPER.find('#work-modal-link').simulate('click');
            expect(WRAPPER.state('workOpen')).to.be.true;
        });

        it('responds to clicking the contact modal link', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('contactOpen')).to.be.false;
            WRAPPER.find('#contact-modal-link').simulate('click');
            expect(WRAPPER.state('contactOpen')).to.be.true;
        });

        it('opens and closes the video', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.state('viewOpen')).to.be.false;
            WRAPPER.find('#video-btn').simulate('click');
            expect(WRAPPER.state('viewOpen')).to.be.true;

            //TODO: how to simulate closing modal?

            //WRAPPER.find('#video-modal').simulate('hide');
            //expect(WRAPPER.state('viewOpen')).to.be.false;
        });

        it('clicks through the carousel slides', function () {
            const WRAPPER = mount(<Home currentUser={{}} />);
            expect(WRAPPER.find('.carousel-indicators li')).to.have.lengthOf(3);
            expect(WRAPPER.find('.carousel-inner .item')).to.have.lengthOf(3);

            //TODO: carsousel simulation behavior is really tricky-- might just test for integration
            /*
            WRAPPER.find('.carousel-indicators li').at(1).simulate('click');
            WRAPPER.find('.carousel-indicators li').at(2).simulate('click');
            expect(WRAPPER.find('.carousel-indicators li').at(2).hasClass('active')).to.be.true;

            expect(WRAPPER.find('.carousel-inner .item').at(2).hasClass('next') ||
                WRAPPER.find('.carousel-inner .item').at(2).hasClass('active')).to.be.true;


            WRAPPER.find('ol.carousel-indicators').children().get(2).simulate('click');
            expect(WRAPPER.find('ol.carousel-indicators').children().get(2).hasClass('active')).to.be.true;
            expect(WRAPPER.find('div.carousel-inner').children().get(2).hasClass('active')).to.be.true;

            WRAPPER.find('ol.carousel-indicators').children().get(1).simulate('click');
            expect(WRAPPER.find('ol.carousel-indicators').children().get(1).hasClass('active')).to.be.true;
            expect(WRAPPER.find('div.carousel-inner').children().get(1).hasClass('active')).to.be.true;*/
        });
    });
};
