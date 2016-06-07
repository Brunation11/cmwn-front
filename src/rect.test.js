console.log("importing");
	
	
import React from 'react'; // eslint-disable-line no-unused-vars
import assert from 'assert';
import {expect} from 'chai';
import Rectangle from 'rectangle';
//import test from 'components/conditional_paragraph.js';

 try {

	// import Rectangle from 'rectangle';
	// console.log(Rectangle);
	
	
	console.log("testing");
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
	/*
	 * describe('Rectangle', () => {
	 * 
	 * describe('#width', () => {
	 * 
	 * 
	 * let rectangle; console.log(rectangle);
	 * 
	 * beforeEach(() => { // Create a new Rectangle object before every test.
	 * console.log("creating:"); rectangle = new Rectangle(10);
	 * console.log(rectangle); });
	 * 
	 * 
	 * it('returns the width', function() { //expect(rectangle.w).to.equal(10);
	 * //console.log(rectangle); //rectangle.w.should.equal(10); }); }); });*/
} catch(err) { 
	console.log(err); console.log(err.stack); 
}
			 