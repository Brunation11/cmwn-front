import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';

import History from 'mocks/mock_history';

describe('Mock History Object', function () {
    it('constructs with defaults', function () {
        var history = new History();
        expect(history.historyStack).to.be.an.instanceof(Array).and.to.be.empty;
        expect(history.currentIndex).to.equal(-1);
    });

    it('go does not work for an empty history', function () {
        var history = new History();
        expect(history.go.bind(0)).to.throw(Error);
        expect(history.go.bind(-5)).to.throw(Error);
        expect(history.go.bind(5)).to.throw(Error);
        expect(history.go.bind(1)).to.throw(Error);
    });

    it('goForward does not work for an empty history', function () {
        var history = new History();
        expect(history.goForward).to.throw(Error);
    });

    it('goBackward does not work for an empty history', function () {
        var history = new History();
        expect(history.goBack).to.throw(Error);
    });

    it('getCurrentLocation returns null for empty history', function () {
        var history = new History();
        expect(history.getCurrentLocation()).to.be.null;
    });

    it('getLocation returns undefined for empty history', function () {
        var history = new History();
        expect(history.getLocation(0)).to.be.undefined;
        expect(history.getLocation(1)).to.be.undefined;
        expect(history.getLocation(-5)).to.be.undefined;
        expect(history.getLocation(10)).to.be.undefined;
    });
});