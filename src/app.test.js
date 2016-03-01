/*global describe, before, it */
import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';

import App from 'app';

describe('Test Utilities', function () {
    describe('Mocha', function () {
        it('Tests are functioning.', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
    describe('Chai', function () {
        it('Chai syntax loads', function () {
            var foo = {foo: 'bar'};
            expect(foo).to.be.a('object');
            expect(foo.foo).to.equal('bar');
        });
    });
});


describe('Application', function () {
    before('render and locate element', function () {
        var renderedComponent = TestUtils.renderIntoDocument(
            <App />
        );
        var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');

        this.appWrapper = inputComponent;
    });
    describe('Bootstrap', function () {
        it('Should insert React elements', function () {
            expect(TestUtils.isDOMComponent(this.appWrapper)).to.be.ok;
        });
    });
});

