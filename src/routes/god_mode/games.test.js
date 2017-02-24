import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { GodModeGames } from 'routes/god_mode/games';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/god_mode/games';
import { FIELDS } from 'routes/god_mode/games';
import { NON_INPUTS } from 'routes/god_mode/games';
import { dataTransform } from 'routes/god_mode/games';
import { filterInputFields } from 'routes/god_mode/games';

import gameData from 'mocks/game_data';
import adminData from 'mocks/users/admin_data';
import principalData from 'mocks/users/principal_data';
import MockFunctionWrapper from 'mocks/mock_function_wrapper';

var createWrapper = function (data, user) {
    var godModeGames = <GodModeGames data={data} currentUser={user} loading={false} />;
    const WRAPPER = shallow(godModeGames);
    return WRAPPER;
};

var createFlipWrapper= function (item) {
    var functions = {
        'renderDeleteButton': GodModeGames.prototype.renderDeleteButton,
        'renderInputField': GodModeGames.prototype.renderInputField,
        'saveGame': GodModeGames.prototype.saveGame,
        'deleteGame': GodModeGames.prototype.deleteGame,
        'toggleOpen': GodModeGames.prototype.toggleOpen,
    }
    var flip = <MockFunctionWrapper
        item={ item }
        functions={ functions }
        render={ GodModeGames.prototype.renderFlip }
    />
    return shallow(flip);
};

var checkContents = function (WRAPPER, flipWrapper) {
    expect(WRAPPER.instance()).to.be.instanceof(GodModeGames);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('#game-flip-board')).to.have.length(2);

    expect(flipWrapper.instance()).to.be.instanceof(MockFunctionWrapper);
    expect(flipWrapper.find('.item')).to.have.length(1);
    expect(flipWrapper.find('.item-panel')).to.have.length(1);
    expect(flipWrapper.find('Form')).to.have.length(1);
    expect(flipWrapper.find('Input')).to.have.length(FIELDS.length - NON_INPUTS.length);
    expect(flipWrapper.find('Button')).to.have.length(4);
};

describe('god mode games route test', function () {
    var transformedData = dataTransform(gameData._embedded.game);
    var game = transformedData[1];
    describe('when viewed by a super admin', function () {
        const WRAPPER = createWrapper(transformedData, adminData);
        var flipWrapper = createFlipWrapper(game);
        it('should display the god mode game edit page', function () {
            var games = { [game.game_id]: game };
            flipWrapper.setState({ games, changed: [] });
            flipWrapper.update();
            checkContents(WRAPPER, flipWrapper);
        });
        it('should open a game when game toggled open', function () {
            flipWrapper.find('.edit-btn').simulate('click');
            flipWrapper.update();
            expect(flipWrapper.find('.open')).to.have.length(1);
        });
        it('should close a game when game toggled close', function () {
            flipWrapper.find('.edit-btn').simulate('click');
            flipWrapper.update();
            expect(flipWrapper.find('.open')).to.have.length(0);
        });
        it('should change checkbox input value on change', function () {
            flipWrapper.find('Input').at(0).simulate('change', { target: { checked: true }});
            flipWrapper.update();
            expect(flipWrapper.find('Input').at(0).prop('checked')).to.equal(true);
        });
        it('should change text input value on change', function () {
            flipWrapper.find('Input').at(1).simulate('change', { target: { value: 'test' }});
            flipWrapper.update();
            expect(flipWrapper.find('Input').at(1).prop('value')).to.equal('test');
        });
    });
});
