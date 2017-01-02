import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import flagData from 'mocks/flag_data';
import blankFlagData from 'mocks/blank_flag_data';
import { FlagView } from 'routes/flags';
import GLOBALS from 'components/globals';

var checkFlagViewRender = function (data) {
    var flagView = <FlagView data={data} loading={false}/>;
    const WRAPPER = shallow(flagView);
    expect(WRAPPER.instance()).to.be.instanceOf(FlagView);
};

var checkFlagViewContent = function (data) {
    var flagView = <FlagView data={data} loading={false}/>;
    const WRAPPER = shallow(flagView);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Table')).to.have.length(1);
};

var checkBlankFlagDataRender = function (data) {
    var flagView = <FlagView data={data} loading={false}/>;
    const WRAPPER = shallow(flagView);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('h2')).to.have.length(1);
}

describe('Flag View Unit Tests', function () {
    describe('Super Viewing Flagged Images', function () {
        it('renders flag data for super users', function () {
            checkFlagViewRender(flagData);
        });

        it('has all of the correct elements', function () {
            checkFlagViewContent(flagData);
        });

        it('displays no flags status message when there is no flag data', function () {
            checkBlankFlagDataRender(blankFlagData);
        });
    });
});
