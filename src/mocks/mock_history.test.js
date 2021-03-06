/* eslint-disable max-lines */
import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';
import _ from 'lodash';

import History from 'mocks/mock_history';

describe('Mock History Object', function () {
    var history;

    beforeEach(function () {
       history = new History;
    });

    it('constructs with defaults', function () {
        expect(history.historyStack).to.be.an.instanceof(Array).and.to.be.empty;
        expect(history.currentIndex).to.equal(-1);
    });

    it('getCurrentLocation returns null for empty history', function () {
        expect(history.getCurrentLocation()).to.be.null;
    });

    it('getLocation returns undefined for empty history', function () {
        expect(history.getLocation(0)).to.be.undefined;
        expect(history.getLocation(1)).to.be.undefined;
        expect(history.getLocation(-5)).to.be.undefined;
        expect(history.getLocation(10)).to.be.undefined;
    });

    describe('go(n)', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('does not work for an empty history', function () {
            expect(history.go.bind(null, 0)).to.throw(Error);
            expect(history.go.bind(null, -5)).to.throw(Error);
            expect(history.go.bind(null, 5)).to.throw(Error);
            expect(history.go.bind(null, 1)).to.throw(Error);
        });

        it('does not work for null input', function () {
            expect(history.go.bind(null, null)).to.throw(Error);
        });

        it('does not work for undefined input', function () {
            expect(history.go.bind(null, undefined)).to.throw(Error);
        });

        it('does not work for none [] input', function () {
            expect(history.go.bind(null, [])).to.throw(Error);
        });

        it('does not work for none {} input', function () {
            expect(history.go.bind(null, {})).to.throw(Error);
        });

        it('does not work for nonsense input', function () {
            expect(history.go.bind(null, () => 'asfhaksf')).to.throw(Error);
        });

        it('does not go too high out of bounds', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            expect(history.go.bind(null, 4)).to.throw(Error);
        });

        it('does not go too low out of bounds', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            expect(history.go.bind(null, -5)).to.throw(Error);
        });

        it('moves to front', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            history.go(-3);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('moves backwards then forward to end', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            history.go(-3);
            history.go(3);
            expect(history.getCurrentLocation().pathname).to.equal('/feed');
        });
    });

    describe('goForward()', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('does not work for an empty history', function () {
            expect(history.goForward).to.throw(Error);
        });

        it('does not work from top of history', function () {
            history.push('/home');
            history.push('/profile');
            expect(history.goForward).to.throw(Error);
        });

        it('works for going forward one entry in history', function () {
            history.push('/profile');
            history.push('/home');
            history.go(-1);
            expect(history.getCurrentLocation().pathname).to.equal('/profile');
            history.goForward();
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('works for going forward multiple entries in history', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            history.go(-3);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
            history.goForward();
            history.goForward();
            expect(history.getCurrentLocation().pathname).to.equal('/settings');
            history.goForward();
            expect(history.getCurrentLocation().pathname).to.equal('/feed');
        });
    });

    describe('goBackward()', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('does not work for an empty history', function () {
            expect(history.goBack).to.throw(Error);
        });

        it('does not work for one entry history', function () {
            history.push('/home');
            expect(history.goBack).to.throw(Error);
        });

        it('works for going back one entry in history', function () {
            history.push('/home');
            history.push('/profile');
            expect(history.getCurrentLocation().pathname).to.equal('/profile');
            history.goBack();
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('works for going back multiple entries in history', function () {
            history.push('/home');
            history.push('/profile');
            history.push('/settings');
            history.push('/feed');
            expect(history.getCurrentLocation().pathname).to.equal('/feed');
            history.goBack();
            history.goBack();
            expect(history.getCurrentLocation().pathname).to.equal('/profile');
            history.goBack();
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });
    });

    describe('pushing and replacing locations in history', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('pushes a location to an empty history', function () {
            var input = {
                pathname: '/home',
                query: {},
                hash: '',
                state: null,
                search: ''
            };
            history.push(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });

        it('pushes mupltiple locations to an history', function () {
            var input = {
                pathname: '/home',
                query: {},
                hash: '',
                state: null,
                search: ''
            };
            history.push('/test?thing=1');
            history.push('/tested?thing=2#down');
            history.push(input);
            expect(history.getCurrentSize()).to.equal(3);
            expect(history.getLocation(0).pathname).to.equal('/test');
            expect(history.getLocation(1).pathname).to.equal('/tested');
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });

        it('does not push duplicate simple string to history', function () {
            history.push('/home');
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
            history.push('/home');
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('does not push duplicate complicated objects to history', function () {
            var input = {
                pathname: '/home',
                query: {'a': 'b'},
                hash: '#thing',
                state: null,
                search: '?a=b'
            };
            history.push(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
            history.push(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('does not push duplicate complicated object/ string to history', function () {
            var input = {
                pathname: '/home',
                query: {'a': 'b'},
                hash: '#thing',
                state: null,
                search: '?a=b'
            };
            history.push(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
            history.push('/home?a=b#thing');
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('replaces a location for an empty history', function () {
            var input = {
                pathname: '/home',
                query: {'a': 'b'},
                hash: '',
                state: null,
                search: '?a=b'
            };
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });


        it('replaces one location in history', function () {
            var input = {
                pathname: '/home',
                query: {},
                hash: '',
                state: null,
                search: ''
            };
            history.replace('/thing?n=1');
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });

        it('replaces multiple locations in history', function () {
            var input = {
                pathname: '/home',
                query: {},
                hash: '',
                state: null,
                search: ''
            };
            history.replace('/test?thing=1');
            history.replace('/test?thing=2#down');
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });

        it('does not replace duplicate simple string to history', function () {
            history.push('/home');
            history.push('/thing');
            expect(history.getCurrentSize()).to.equal(2);
            expect(history.getCurrentLocation().pathname).to.equal('/thing');
            history.replace('/home');
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('does not replace duplicate complicated objects to history', function () {
            var input = {
                pathname: '/home',
                query: {'a': 'b'},
                hash: '#thing',
                state: null,
                search: '?a=b'
            };
            history.push(input);
            history.push('/thing');
            expect(history.getCurrentSize()).to.equal(2);
            expect(history.getCurrentLocation().pathname).to.equal('/thing');
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('does not replace duplicate complicated object/ string to history', function () {
            var input = {
                pathname: '/home',
                query: {'a': 'b'},
                hash: '#thing',
                state: null,
                search: '?a=b'
            };
            history.push('/home?a=b#thing');
            history.push('/thing');
            expect(history.getCurrentSize()).to.equal(2);
            expect(history.getCurrentLocation().pathname).to.equal('/thing');
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(1);
            expect(history.getCurrentLocation().pathname).to.equal('/home');
        });

        it('handles combination of pushing and replacing', function () {
            var input = {
                pathname: '/home',
                query: {},
                hash: '',
                state: null,
                search: ''
            };
            history.push('/test?thing=1');
            history.push('/tester?thing=2#down');
            history.replace('/tested?thing=3');
            history.push('/testing?thing=4');
            history.replace(input);
            expect(history.getCurrentSize()).to.equal(3);
            expect(history.getLocation(0).pathname).to.equal('/test');
            expect(history.getLocation(1).pathname).to.equal('/tested');
            expect(_.isEqual(history.getCurrentLocation(), input)).to.be.true;
        });
    });

    describe('splitAtIndex(s, n)', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('handles null string input', function () {
            var result = history.splitAtIndex(null, 0);
            expect(_.isEqual(result, [''])).to.be.true;
        });

        it('handles undefined string input', function () {
            var result = history.splitAtIndex(undefined, 0);
            expect(_.isEqual(result, [''])).to.be.true;
        });

        it('handles none [] string input', function () {
            expect(history.splitAtIndex([], 0)).to.be.undefined;
        });

        it('handles none {} string input', function () {
            expect(history.splitAtIndex({}, 0)).to.be.undefined;
        });

        it('handles nonsense string input', function () {
            expect(history.splitAtIndex({'cat': 5, 'dog': null, 'cow': 'sadfjjsaf'})).to.be.undefined;
        });

        it('handles null split index input', function () {
            var result = history.splitAtIndex('cat', null);
            expect(_.isEqual(result, ['cat'])).to.be.true;
        });

        it('handles undefined split index input', function () {
            var result = history.splitAtIndex('cat', undefined);
            expect(_.isEqual(result, ['cat'])).to.be.true;
        });

        it('handles none [] split index input', function () {
            var result = history.splitAtIndex('cat', []);
            expect(_.isEqual(result, ['cat'])).to.be.true;

        });

        it('handles none {} split index input', function () {
            var result = history.splitAtIndex('cat', []);
            expect(_.isEqual(result, ['cat'])).to.be.true;
        });

        it('handles nonsense split index input', function () {
            var result = history.splitAtIndex('cat', {'cat': 5, 'dog': null, 'cow': 'sadfjjsaf'});
            expect(_.isEqual(result, ['cat'])).to.be.true;
        });

        it('handles split at negative index', function () {
            var result = history.splitAtIndex('kangaroo', -1);
            expect(_.isEqual(result, ['kangaroo'])).to.be.true;
        });

        it('handles split out of bounds large index', function () {
            var result = history.splitAtIndex('kangaroo', 10);
            expect(_.isEqual(result, ['kangaroo'])).to.be.true;
        });

        it('splits at first character', function () {
            var result = history.splitAtIndex('kangaroo', 0);
            expect(_.isEqual(result, ['', 'angaroo'])).to.be.true;
        });

        it('splits at last character', function () {
            var result = history.splitAtIndex('kangaroo', 7);
            expect(_.isEqual(result, ['kangaro', ''])).to.be.true;
        });

        it('splits at middle odd character', function () {
            var result = history.splitAtIndex('kangaroo', 3);
            expect(_.isEqual(result, ['kan', 'aroo'])).to.be.true;
        });

        it('splits at middle even character', function () {
            var result = history.splitAtIndex('kangaroo', 4);
            expect(_.isEqual(result, ['kang', 'roo'])).to.be.true;
        });
    });


    // Parse search unit tests
    describe('parseSearch(s)', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('handles null input', function () {
            var result = history.parseSearch(null);
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles undefined input', function () {
            var result = history.parseSearch(undefined);
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles none [] input', function () {
            var result = history.parseSearch([]);
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles none {} input', function () {
            var result = history.parseSearch({});
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles nonsense input', function () {
            var result = history.parseSearch({'cat': 5, 'dog': null, 'cow': 'sadfjjsaf'});
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles empty search string', function () {
            var result = history.parseSearch('?');
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles one key value pair', function () {
            var result = history.parseSearch('?cat=dog');
            expect(_.isEqual(result, {'cat': 'dog'})).to.be.true;
        });

        it('handles multiple key value pairs', function () {
            var result = history.parseSearch('?cat=dog&thing=5&6=6');
            expect(_.isEqual(result, {'cat': 'dog', 'thing': '5', '6': '6'})).to.be.true;
        });

        it('handles only ampersand', function () {
            var result = history.parseSearch('?&');
            expect(_.isEqual(result, {})).to.be.true;
        });

        it('handles preceeded by ampersand', function () {
            var result = history.parseSearch('?&cat=dog');
            expect(_.isEqual(result, {'cat': 'dog'})).to.be.true;
        });

        it('handles empty key value pair', function () {
            var result = history.parseSearch('?cat=');
            expect(_.isEqual(result, {'cat': ''})).to.be.true;
        });

        it('handles empty key without = value ', function () {
            var result = history.parseSearch('?cat');
            expect(_.isEqual(result, {'cat': null})).to.be.true;
        });

        it('handles value with equal sign', function () {
            var result = history.parseSearch('?cat==3');
            expect(_.isEqual(result, {'cat': '=3'})).to.be.true;
        });

        it('handles trailing & sign', function () {
            var result = history.parseSearch('?cat=dog&');
            expect(_.isEqual(result, {'cat': 'dog', '': null})).to.be.true;
        });

        it('handles multiple & signs', function () {
            var result = history.parseSearch('?cat=dog&&&thing=me');
            expect(_.isEqual(result, {'cat': 'dog', '': [null, null],'thing': 'me'})).to.be.true;
        });

        it('handles empty key', function () {
            var result = history.parseSearch('?=cat');
            expect(_.isEqual(result, {'': 'cat'})).to.be.true;
        });

        it('handles empty key and value', function () {
            var result = history.parseSearch('?=');
            expect(_.isEqual(result, {'': ''})).to.be.true;
        });

        it('handles duplicate key', function() {
            var result = history.parseSearch('?dog=cat&dog=mouse');
            expect(_.isEqual(result, {dog: ['cat', 'mouse']})).to.be.true;
        });

        it('handles complex duplicate key', function() {
            var result = history.parseSearch('?dog=cat&dog=mouse&cat=thing&dog=woof');
            expect(_.isEqual(result, {dog: ['cat', 'mouse', 'woof'], 'cat': 'thing'})).to.be.true;
        });
    });

    describe('createLocation(location)', function () {
        var history;

        beforeEach(function () {
            history = new History;
        });

        it('handles null input', function () {
            expect(history.createLocation.bind(null, null)).to.throw(Error);
        });

        it('handles undefined input', function () {
            expect(history.createLocation.bind(null, undefined)).to.throw(Error);
        });

        it('handles none [] input', function () {
            expect(history.createLocation.bind(null, [])).to.throw(Error);
        });

        it('handles none {} input', function () {
            expect(history.createLocation.bind(null, {})).to.throw(Error);
        });

        it('handles nonsense input', function () {
            expect(history.createLocation.bind(null, () => {
                return {'cat': 5, 'dog': null};
            })).to.throw(Error);
        });

        it('handles pathname null input in object', function () {
            expect(history.createLocation.bind(null, {pathname: null})).to.throw(Error);
        });

        it('handles pathname undefined input in object', function () {
            expect(history.createLocation.bind(null, {pathname: undefined})).to.throw(Error);
        });

        it('handles pathname none [] input in object', function () {
            expect(history.createLocation.bind(null, {pathname: []})).to.throw(Error);
        });

        it('handles pathname none {} input in object', function () {
            expect(history.createLocation.bind(null, {pathname: {}})).to.throw(Error);
        });

        it('handles pathname nonsense input in object', function () {
            expect(history.createLocation.bind(null, {
                pathname: () => {
                    return {'cat': 5, 'dog': null};
                }
            })).to.throw(Error);
        });

        it('handles a simple string', function () {
            var result = history.createLocation('/route');
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('');
            expect(result.hash).to.equal('');
            expect(_.isEqual(result.query, {})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles a string with search params', function () {
            var result = history.createLocation('/route?thing=b&c=b');
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('?thing=b&c=b');
            expect(result.hash).to.equal('');
            expect(_.isEqual(result.query, {'thing': 'b', 'c': 'b'})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles a string with hash', function () {
            var result = history.createLocation('/route#thing');
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('');
            expect(result.hash).to.equal('#thing');
            expect(_.isEqual(result.query, {})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles a string with search params followed by hash', function () {
            var result = history.createLocation('/route?thing=b&c=b#thing');
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('?thing=b&c=b');
            expect(result.hash).to.equal('#thing');
            expect(_.isEqual(result.query, {'thing': 'b', 'c': 'b'})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles a string with incomplete search params followed by hash', function () {
            var result = history.createLocation('/route?thing&c=#thing');
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('?thing&c=');
            expect(result.hash).to.equal('#thing');
            expect(_.isEqual(result.query, {'thing': null, 'c': ''})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles simple object with pathname field', function () {
            var input = {pathname: '/route'};
            var result = history.createLocation(input);
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('');
            expect(result.hash).to.equal('');
            expect(_.isEqual(result.query, {})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles simple object with fields', function () {
            var input = {
                pathname: '/route',
                search: '?c=d&l=B',
                hash: '#cat'
            };
            var result = history.createLocation(input);
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('?c=d&l=B');
            expect(result.hash).to.equal('#cat');
            expect(_.isEqual(result.query, {'c': 'd', 'l': 'B'})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles simple object with undefined fields', function () {
            var input = {
                pathname: '/route',
                search: undefined,
                hash: undefined,
                state: undefined
            };
            var result = history.createLocation(input);
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('');
            expect(result.hash).to.equal('');
            expect(_.isEqual(result.query, {})).to.be.true;
            expect(result.state).to.be.null;
        });

        it('handles simple object with null fields', function () {
            var input = {
                pathname: '/route',
                search: null,
                hash: null,
                state: null
            };
            var result = history.createLocation(input);
            expect(result.pathname).to.equal('/route');
            expect(result.search).to.equal('');
            expect(result.hash).to.equal('');
            expect(_.isEqual(result.query, {})).to.be.true;
            expect(result.state).to.be.null;
        });
    });
});
