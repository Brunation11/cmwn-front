import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import homeSmoke from 'smoke_tests/home.test.js';

describe('Home Page Smoke Tests', function () {
    homeSmoke();
});
