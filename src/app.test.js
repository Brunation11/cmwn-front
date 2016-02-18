import assert from 'assert';
import {expect} from 'chai';

import App from 'app';

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Chai', function () {
    it('should allow chai syntax in tests', function () {
        var foo = {foo: 'bar'};
        var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
        expect(foo).to.be.a('string');
        expect(foo).to.equal('bar');
        expect(foo).to.have.length(3);
        expect(beverages).to.have.property('tea').with.length(3);
    });
});

