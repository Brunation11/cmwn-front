import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import Shortid from 'shortid';
import { connect } from 'react-redux';
import {Button, Input, Panel} from 'react-bootstrap';

import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';

import Layout from 'layouts/two_col';

import 'routes/god_mode/games.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'god-mode-games';

const GAME_WRAPPER = GenerateDataSource('games', PAGE_UNIQUE_IDENTIFIER);

const FIELDS = {
    'coming_soon': '',
    'description': '',
    'game_id': '',
    'desktop': false,
    'unity': false,
    'title': '',
};

const FIELD_TYPES = {
    'coming_soon': 'checkbox',
    'description': 'textarea',
    'game_id': 'text',
    'desktop': 'checkbox',
    'unity': 'checkbox',
    'title': 'text',
};

const FIELD_LABELS = {
    'coming_soon': 'Coming Soon',
    'description': 'Description',
    'game_id': 'Game ID',
    'desktop': 'Desktop Only',
    'unity': 'Unity',
    'title': 'Title',
};

export class GodModeGames extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: '',
            games: {},
        };
    }

    addInputTypes(item, games, gameId) {
        _.forEach(item, (inputValue, inputType) => {
            if (typeof inputValue === 'object') {
                games = this.addInputTypes(inputValue, games, gameId);
            } else {
                if (inputType in FIELDS) games[gameId][inputType] = inputValue;
            }
        });

        return games;
    }

    addGameInputData(item) {
        var games = this.state.games;
        var gameId = item.game_id;
        games[gameId] = {};

        //games = this.addInputTypes(item, games, gameId);

        _.forEach(item, (inputValue, inputType) => {
            if (typeof inputValue === 'object') {
                _.forEach(inputValue, (inputValue_, inputType_) => {
                    if (inputType_ in FIELDS) games[gameId][inputType_] = inputValue_;
                });
            } else {
                if (inputType in FIELDS) games[gameId][inputType] = inputValue;
            }
        });

        games[gameId].key = Shortid.generate();

        return games;
    }

    toggleOpen(openGame, item) {
        if (!this.state.games[item.game_id]) {
            var games = this.addGameInputData(item);
            this.setState({games}, () => {
                this.setState({open: openGame ? item.game_id : ''});
            });
        } else {
            this.setState({open: openGame ? item.game_id : ''});
        }
    }

    renderInputField(inputValue, inputType, gameId, key) {
        var games = this.state.games;
        var self = this;

        if (!games[gameId]) {
            return (
               <Input
                    type={FIELD_TYPES[inputType]}
                    label={FIELD_LABELS[inputType]}
                    ref={`${inputType}-input`}
                    name={`${inputType}-input`}
                    key={key}
                    placeholder="NO DATA"
               />
            );
        } 

        if (FIELD_TYPES[inputType] === 'checkbox') {
            return (
               <Input
                    type={FIELD_TYPES[inputType]}
                    label={FIELD_LABELS[inputType]}
                    checked={games[gameId][inputType]}
                    ref={`${inputType}-input`}
                    name={`${inputType}-input`}
                    key={key}
                    onChange={e => {
                        games[gameId][inputType] = e.target.checked;
                        self.setState({games});
                    }}
               />
            );
        }

        return (
           <Input
                className={FIELD_TYPES[inputType]}
                type={FIELD_TYPES[inputType]}
                label={FIELD_LABELS[inputType]}
                value={games[gameId][inputType]}
                ref={`${inputType}-input`}
                name={`${inputType}-input`}
                key={key}
                onChange={e => {
                    games[gameId][inputType] = e.target.value
                    self.setState({games});
                }}
           />
        );
    }

    renderFlip(item) {
        var open = this.state.open === item.game_id;
        var text = open ? 'CLOSE' : 'EDIT';
        var currentItem = this.state.games[item.game_id] ? this.state.games[item.game_id] : item;
        var form = _.map(Object.keys(currentItem), (inputType, key) => {
            return this.renderInputField(currentItem[inputType], inputType, item.game_id, key);
        });
        var title = currentItem.title === '' ? '<BLANK>' : currentItem.title;

        return (
            <div className="item" key={currentItem.key}>
                <Panel header={title} className={ClassNames(
                        'item-panel',
                        'standard', {
                            open
                        }
                    )}
                >
                    <div className="form">
                        {form}
                    </div>
                    <br />
                    <Button
                        className="btn standard purple save-btn"
                    >
                        SAVE
                    </Button>
                </Panel>
                <Button
                    className="btn standard green edit-btn"
                    onClick={this.toggleOpen.bind(this, !open, currentItem)}
                >
                    {text}
                </Button>
            </div>
        );
    }

    render() {
        if (!this.props.data) return null;
        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
               <GAME_WRAPPER>
                   <FlipBoard
                        renderFlip={this.renderFlip.bind(this)}
                        id="game-flip-board"
                        header={null}
                   />
               </GAME_WRAPPER>
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(GodModeGames);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

