import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Layout from 'layouts/home';
import { COPY } from 'layouts/home';
import { SOURCES } from 'layouts/home';


export var checkLayoutContents = function (wrapper) {
    expect(wrapper.children()).to.have.lengthOf(1);
    expect(wrapper.children('.content')).to.have.lengthOf(1);
    expect(wrapper.find('.layout').children('.content')).to.have.lengthOf(1);
    expect(wrapper.find('.content-group .message')).to.have.lengthOf(1);
    expect(wrapper.find('.content-group .message').children()).to.have.lengthOf(2 +
        COPY.PARAGRAPHS.length);
    expect(wrapper.find('.content-group .partners').children()).to.have.lengthOf(2);
    expect(wrapper.find('.logos').children()).to.have.lengthOf(SOURCES.PARTNERS.length);
    expect(wrapper.find('footer.links')).to.have.lengthOf(1);
    expect(wrapper.find('footer.links').children()).to.have.lengthOf(3);
};

describe('Layout/Home Unit Tests', function () {
    describe('Anonymous user viewing homepage', function () {
        it('Renders homepage using mount', function () {
            const WRAPPER = shallow(<Layout />);
            expect(WRAPPER.instance()).to.be.instanceOf(Layout);
        });

        it('Has the correct home contents', function () {
            const WRAPPER = shallow(<Layout />);
            checkLayoutContents(WRAPPER);
        });

        it('responds to clicking links', function () {
            var modalInfo = {modal: null};
            var mockOpenModal = x => { modalInfo.modal = x; };
            const WRAPPER = shallow(<Layout openModal={mockOpenModal} />);
            expect(modalInfo.modal).to.be.null;
            WRAPPER.find('#work-modal-link').simulate('click');
            expect(modalInfo.modal).to.equal('work');
            WRAPPER.find('#contact-modal-link').simulate('click');
            expect(modalInfo.modal).to.equal('contact');
        });
    });
});
