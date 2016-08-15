import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';
//import _ from 'lodash';

import Util from 'components/util';

describe('setPageTitle', function () {
    it('handles null input', function () {
        Util.setPageTitle(null);
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('Change My World Now');
    });

    it('handles undefined input', function () {
        Util.setPageTitle(undefined);
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('Change My World Now');
    });

    it('handles none [] input', function () {
        Util.setPageTitle([]);
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('Change My World Now');
    });

    it('handles none {} input', function () {
        Util.setPageTitle({});
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('Change My World Now');
    });

    it('handles nonsense input', function () {
        Util.setPageTitle(function () {
            return {'asfnas': 3457834};
        });
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('Change My World Now');
    });

    it('handles empty string', function () {
        Util.setPageTitle('');
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('');
    });

    it('handles simple string', function () {
        Util.setPageTitle('hi');
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('hi');
    });

    it('handles complex string', function () {
        Util.setPageTitle('hi, my name is bob.');
        var el = document.getElementsByTagName('title')[0];
        expect(el.innerHTML).to.equal('hi, my name is bob.');
    });
});


describe('matchPathandExtractParams', function () {
    it('handles null route', function () {
        var params = Util.matchPathAndExtractParams(null, '/home');
        expect(params).to.be.false;
    });

    it('handles undefined route', function () {
        var params = Util.matchPathAndExtractParams(undefined, '/home');
        expect(params).to.be.false;
    });

    it('handles none \'\' route', function () {
        var params = Util.matchPathAndExtractParams('', '/home');
        expect(params).to.be.false;
    });

    it('handles nonsense route', function () {
        var params = Util.matchPathAndExtractParams(() => {
            yo: 'you'
        }, '/home');
        expect(params).to.be.false;
    });

    it('handles null path', function () {
        var params = Util.matchPathAndExtractParams('home(/)', null);
        expect(params).to.be.false;
    });

    it('handles undefined path', function () {
        var params = Util.matchPathAndExtractParams('home(/)', undefined);
        expect(params).to.be.false;
    });

    it('handles none \'\' path', function () {
        var params = Util.matchPathAndExtractParams('home(/)', '');
        expect(params).to.be.false;
    });

    it('handles both undefined path', function () {
        var params = Util.matchPathAndExtractParams(undefined, undefined);
        expect(params).to.be.false;
    });

    it('handles nonsense path', function () {
        var params = Util.matchPathAndExtractParams('home(/)', () => {
            yo: 'you'
        });
    });

    it('handles both null path', function () {
        var params = Util.matchPathAndExtractParams(null, null);
        expect(params).to.be.false;
    });

    it('handles two empty paths', function () {
        var params = Util.matchPathAndExtractParams('', '');
        expect(params).to.deep.equal({});
    });

    it('handles two root paths', function () {
        var params = Util.matchPathAndExtractParams('(/)', '/');
        expect(params).to.deep.equal({});
    });

    it('extracts simple parameter', function () {
        var params = Util.matchPathAndExtractParams(':id', 'cat');
        expect(params).to.deep.equal({id: 'cat'});
    });

    it('extracts simple parameter with slashes', function () {
        var params = Util.matchPathAndExtractParams('/:id/', '/cat/');
        expect(params).to.deep.equal({id: 'cat'});
    });

    it('extracts simple parameter with slashes and parenthesis', function () {
        var params = Util.matchPathAndExtractParams('/:id(/)', '/cat/');
        expect(params).to.deep.equal({id: 'cat'});
    });

    it('extracts parameter with complex path', function () {
        var params = Util.matchPathAndExtractParams('user/:id/edit(/)', '/user/dog/edit/');
        expect(params).to.deep.equal({id: 'dog'});
    });

    it('extracts multiple parameters', function () {
        var params = Util.matchPathAndExtractParams(':id/:name(/)', '/me/you');
        expect(params).to.deep.equal({id: 'me', name: 'you'});
    });

    it('extracts multiple parameters with complex path', function () {
        var params = Util.matchPathAndExtractParams('page/user/:id/show/:name(/)', '/page/user/me/show/you/');
        expect(params).to.deep.equal({id: 'me', name: 'you'});
    });

    it('handles invalid longer path', function () {
        var params = Util.matchPathAndExtractParams('user/:id/edit(/)', '/user/dog/edit/thing');
        expect(params).to.equal.false;
    });

    it('handles invalid longer route', function () {
        var params = Util.matchPathAndExtractParams('user/:id/edit/thing(/)', '/user/dog/edit/');
        expect(params).to.equal.false;
    });

    it('handles mismatched start route & path of same length', function () {
        var params = Util.matchPathAndExtractParams('user/:id/edit(/)', '/users/dog/edit/');
        expect(params).to.equal.false;
    });

    it('handles mismatched end route & path of same length', function () {
        var params = Util.matchPathAndExtractParams('user/:id/edit(/)', '/user/dog/editing/');
        expect(params).to.equal.false;
    });
});

describe('replacePathPlaceholdersFromParamObject', function () {
    it('handles null param object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id', null);
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles undefined param object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id', undefined);
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles none {} param object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id', {});
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles none [] param object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id', []);
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles nonsense param object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id', Util);
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles incorrectly spaced colon', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/a:id', {'id': 'a'});
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles null route object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, null, {});
        expect(boundMethod).to.throw('Path could not be constructed; Expected route to be a string.');
    });

    it('handles undefined route object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, undefined, {});
        expect(boundMethod).to.throw('Path could not be constructed; Expected route to be a string.');
    });

    it('handles none route object', function () {
        expect(Util.replacePathPlaceholdersFromParamObject('', {})).to.equal('');
    });

    it('handles nonsense route object', function () {
        var boundMethod = Util.replacePathPlaceholdersFromParamObject.bind(null, '//asdfksadfj::sid223', {});
        expect(boundMethod).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles simple param', function () {
        var path = Util.replacePathPlaceholdersFromParamObject('/:id', {'id': 'cat'});
        expect(path).to.equal('cat');
    });

    it('handles one param with complex path', function () {
        var path = Util.replacePathPlaceholdersFromParamObject('/user/:id/edit', {'id': 'cat'});
        expect(path).to.equal('user/cat/edit');
    });

    it('handles extra slashes', function () {
        var path = Util.replacePathPlaceholdersFromParamObject('user///:id/edit', {'id': 'cat'});
        expect(path).to.equal('user/cat/edit');
    });

    it('handles extraneous params', function () {
        var path = Util.replacePathPlaceholdersFromParamObject('/user/:id/edit', {'id': 'cat', 'd': 'c'});
        expect(path).to.equal('user/cat/edit');
    });

    it('handles missing param', function () {
        var bound = Util.replacePathPlaceholdersFromParamObject.bind(null, '/user/:id/edit', {'n': 't'});
        expect(bound).to.throw('Path could not be constructed; Expected parameter was not passed.');
    });

    it('handles multiple params', function () {
        var path = Util.replacePathPlaceholdersFromParamObject('/:name/:id', {'id': 'c', 'name': 'l'});
        expect(path).to.equal('l/c');
    });

    it('handles multiple params with complex path', function () {
        var params = {'id': 'c', 'name': 'l'};
        var path = Util.replacePathPlaceholdersFromParamObject('user/:name/thing/:id/here', params);
        expect(path).to.equal('user/l/thing/c/here');
    });
});


describe('decode permissions', function () {

    it('handles null input', function () {
        var perms = Util.decodePermissions(null);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles undefined input', function () {
        var perms = Util.decodePermissions(undefined);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles none [] input', function () {
        var perms = Util.decodePermissions(undefined);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles none {} input', function () {
        var perms = Util.decodePermissions(undefined);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles nonsense input', function () {
        var perms = Util.decodePermissions(function () {
            return 'sadfasj'
        });
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles string input', function () {
        var perms = Util.decodePermissions('hello world');
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles 0 permission', function () {
        var perms = Util.decodePermissions(0);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles super negative permission', function () {
        var perms = Util.decodePermissions(-9);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles too large permission', function () {
        var perms = Util.decodePermissions(9);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles -1 superuser permission', function () {
        var perms = Util.decodePermissions(-1);
        expect(perms.create).to.be.true;
        expect(perms.update).to.be.true;
        expect(perms.delete).to.be.true;
    });

    // D:1, U:2, C:4
    it('handles delete permission', function () {
        var perms = Util.decodePermissions(1);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.true;
    });

    it('handles update permission', function () {
        var perms = Util.decodePermissions(2);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.true;
        expect(perms.delete).to.be.false;
    });

    it('handles create permission', function () {
        var perms = Util.decodePermissions(4);
        expect(perms.create).to.be.true;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.false;
    });

    it('handles delete & update permission', function () {
        var perms = Util.decodePermissions(3);
        expect(perms.create).to.be.false;
        expect(perms.update).to.be.true;
        expect(perms.delete).to.be.true;
    });

    it('handles delete & create permission', function () {
        var perms = Util.decodePermissions(5);
        expect(perms.create).to.be.true;
        expect(perms.update).to.be.false;
        expect(perms.delete).to.be.true;
    });

    it('handles create & update permission', function () {
        var perms = Util.decodePermissions(6);
        expect(perms.create).to.be.true;
        expect(perms.update).to.be.true;
        expect(perms.delete).to.be.false;
    });

    it('handles delete, create & update permission', function () {
        var perms = Util.decodePermissions(7);
        expect(perms.create).to.be.true;
        expect(perms.update).to.be.true;
        expect(perms.delete).to.be.true;
    });
});

describe('formatString', function () {

    it('handles null input', function () {
        expect(Util.formatString.bind(null, null, 'test')).to.throw('First argument must be a string.');
    });

    it('handles undefined input', function () {
        expect(Util.formatString.bind(null, undefined, 'test')).to.throw('First argument must be a string.');
    });

    it('handles none [] input', function () {
        expect(Util.formatString.bind(null, [], 'test')).to.throw('First argument must be a string.');
    });

    it('handles none {} input', function () {
        expect(Util.formatString.bind(null, {}, 'test')).to.throw('First argument must be a string.');
    });

    it('handles nonsense input', function () {
        expect(Util.formatString.bind(null, () => {
            return {'abc': 123};
        }, 'test')).to
        .throw('First argument must be a string.');
    });

    it('does not have the argument specified', function () {
        expect(Util.formatString.bind(null, 'thing {0}')).to.throw('String has unmatched template variables.');
    });

    it('does not have the arguments (multiple) specified', function () {
        expect(Util.formatString.bind(null, 'thing {0} {1} {2}'), 'cat').to
            .throw('String has unmatched template variables.');
    });

    it('handles empty string', function () {
        expect(Util.formatString('')).to.equal('');
    });

    it('handles one replacable', function () {
        var formatted = Util.formatString('this is {0}, a simple test', 'tester');
        expect(formatted).to.equal('this is tester, a simple test');
    });

    it('handles one stating replacable', function () {
        var formatted = Util.formatString('{0}, a simple test', 'tester');
        expect(formatted).to.equal('tester, a simple test');
    });

    it('handles one ending replacable', function () {
        var formatted = Util.formatString('this is {0}', 'tester');
        expect(formatted).to.equal('this is tester');
    });

    it('handles odd number of multiple replacables', function () {
        var formatted = Util.formatString('this is {0}, a more {1} and complex {2}.', 'cow', 'fun', 'test');
        expect(formatted).to.equal('this is cow, a more fun and complex test.');
    });

    it('handles even number of multiple replacables', function () {
        var formatted = Util.formatString('this is {0}, a {1} {2} {3}.', 'cow', 'more', 'fun', 'test');
        expect(formatted).to.equal('this is cow, a more fun test.');
    });

    it('handles replacables with multiple brackets', function () {
        var formatted = Util.formatString('here {we {{0}} }go{}?', 'maybe');
        expect(formatted).to.equal('here {we {maybe} }go{}?');
    });
});
