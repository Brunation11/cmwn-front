import React from 'react';
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';

import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';

