import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import surveyData from 'mocks/aay_survey_data.js';
import SurveyModal from 'components/popovers/survey_modal';

var checkSurveyModal = function (data) {
    var tempData = {
                    username: 'foo',
                    data: data._embedded.items[0].data
    };
    var surveyModal = <SurveyModal data={tempData} loading={false} showModal={false}/>

    const WRAPPER = shallow(surveyModal);
    expect(WRAPPER.instance()).to.be.instanceOf(SurveyModal);
    expect(WRAPPER.children()).to.have.length(2);
    expect(WRAPPER.find('Modal')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
}

describe("SurveyModal Unit Test", function(){
    describe("SurveyModal view", function(){
        it('renders correctly', function(){
            checkSurveyModal(surveyData);
        })
    })
})
