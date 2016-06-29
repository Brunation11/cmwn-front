/*global describe, it */
import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import {expect} from 'chai';

import profileSmoke from 'smoke_tests/users/profile.test.js'

describe('Smoke Tests', function() {
    describe('user profile basics', function() {
       profileSmoke();
    });
    
});
