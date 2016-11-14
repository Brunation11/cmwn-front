import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import surveyData from 'mocks/aay_survey_data.js';
import { AAYView } from 'routes/aay_survey';
import GLOBALS from 'components/globals';

var checkSurveyRender = function (data) {
    var aayView = <AAYView data={data._embedded.items} loading={false} links={data._links.self.href}/>;
    const WRAPPER = shallow(aayView);
    expect(WRAPPER.instance()).to.be.instanceOf(AAYView);
}

var checkSurveyContent = function (data) {
    var aayView = <AAYView data={data._embedded.items} loading={false} links={data._links.self.href}/>;
    const WRAPPER = shallow(aayView);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Table')).to.have.length(1);
}

describe('AAYView Unit Tests', function(){
    describe('Super viewing survey data', function(){
        it('renders AAYView component', function(){
            checkSurveyRender(surveyData);
        });
        it('has all correct components', function(){
            checkSurveyContent(surveyData);
        });
    });
});
