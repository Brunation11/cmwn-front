import React from 'react';
//import { expect } from 'chai';
//import { shallow } from 'enzyme';

//import { TermsPage } from 'routes/terms';
//import { PAGE_UNIQUE_IDENTIFIER } from 'routes/terms';

import termsSmokeTest from 'smoke_tests/terms.test';

describe('terms page unit tests', function () {
    describe('smoke test', function () {
        termsSmokeTest();
    });
});
