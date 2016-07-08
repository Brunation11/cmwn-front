import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';

import { History } from 'mocks/mock_history';

describe('Mock History Object', function () {
    it('constructs with defaults', function () {
        var history = new History();
        expect(history.historyStack).to.equal([]);
        expect(history.currentIndex).to.equal(-1);
    });
});