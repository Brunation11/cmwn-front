import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';
//import _ from 'lodash';

import Util from 'components/util';

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
        var perms = Util.decodePermissions(function() {return 'sadfasj'});
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