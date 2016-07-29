import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { TermsPage } from 'routes/terms';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/terms';

import termsSmokeTest from 'smoke_tests/terms.test';

describe('terms page unit tests', function () {
    it('should load the terms page', function () {
        const WRAPPER = shallow(<TermsPage />);
        expect(WRAPPER.instance()).to.be.instanceof(TermsPage);
        expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
        expect(WRAPPER.find('.terms')).to.have.length(1);
        for(var i = 0; i < 25; i++) {
            var ft = '.ft' + i;
            var length = 1;
            switch (i) {
                case 1: length = 5; break;
                case 2: length = 3; break;
                case 3: length = 36; break;
                case 4: length = 2; break;
                case 5: length = 6; break;
                case 6: length = 3; break;
                case 7: length = 10; break;
                case 8: length = 15; break;
                case 9: length = 5; break;
                case 11: length = 2; break;
                case 12: length = 3; break;
                case 13: length = 0; break;
                case 15: length = 4; break;
                case 16: length = 0; break;
                case 23: length = 2; break;
            }
            expect(WRAPPER.find(ft)).to.have.length(length);
        }
    });
    describe('smoke test', function () {
        termsSmokeTest();
    });
});
