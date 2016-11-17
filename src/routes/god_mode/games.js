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

    toggleOpen(editGame, item) {
        var games = this.state.games;
        var gameId = item.game_id;

        if (!games[item.game_id]) {
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
        }

        this.setState({
            open: editGame ? item.game_id : '',
            games,
        });
    }

    renderInputField(inputValue, inputType, gameId) {
        var games = this.state.games;
        var game = games[gameId];
        var self = this;

        if (FIELD_TYPES[inputType] === 'checkbox') {
            return (
               <Input
                    type={FIELD_TYPES[inputType]}
                    label={FIELD_LABELS[inputType]}
                    checked={game[inputType]}
                    ref={`${inputType}-input`}
                    name={`${inputType}-input`}
                    key={Shortid.generate()}
                    onInput={e => {
                        games[gameId][inputType] = e.target.checked;
                        self.setState({games});
                    }}
               />
            );
        }

        return (
           <Input
                className="text"
                type={FIELD_TYPES[inputType]}
                label={FIELD_LABELS[inputType]}
                value={game[inputType]}
                ref={`${inputType}-input`}
                name={`${inputType}-input`}
                key={Shortid.generate()}
                onInput={e => {
                    games[gameId][inputType] = e.target.value
                    self.setState({games});
                }}
           />
        );
    }

    renderFlip(item) {
        var open = this.state.open === item.game_id;
        var text = open ? 'Close' : 'Edit';

        var form = open ? _.map(this.state.games[item.game_id], (inputValue, inputType) => {
            return this.renderInputField(inputValue, inputType, item.game_id);
        }) : null;

        return (
            <div className="item" key={Shortid.generate()}>
                <Panel header={item.title} className={ClassNames(
                        'item-panel',
                        'standard', {
                            open
                        }
                    )}
                >
                    <div className="body">
                        {form}
                    </div>
                </Panel>
                <Button
                    className="btn standard green edit-btn"
                    onClick={this.toggleOpen.bind(this, !open, item)}
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
                        header={false}
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

