import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import {Button, Input, Panel} from 'react-bootstrap';

import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import Form from 'components/form';

import Layout from 'layouts/god_mode_two_col';

import 'routes/god_mode/games.scss';

var mapStateToProps;
var Page;

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-games';

const GAME_WRAPPER = GenerateDataSource('games', PAGE_UNIQUE_IDENTIFIER);

export const FIELDS = [
    'title',
    'description',
    'coming_soon',
    'desktop',
    'unity',
    'meta',
    'key',
    'newGame',
    'game_id',
];

export const NON_INPUTS = [
    'meta',
    'key',
    'newGame',
    'game_id',
];

const FIELD_TYPES = {
    [FIELDS[0]]: 'text',
    [FIELDS[1]]: 'textarea',
    [FIELDS[2]]: 'checkbox',
    [FIELDS[3]]: 'checkbox',
    [FIELDS[4]]: 'checkbox',
};

const FIELD_LABELS = {
    [FIELDS[0]]: 'Title',
    [FIELDS[1]]: 'Description',
    [FIELDS[2]]: 'Coming Soon',
    [FIELDS[3]]: 'Desktop Only',
    [FIELDS[4]]: 'Unity',
};

const NEW_GAME = {
    [FIELDS[0]]: 'New Game',
    [FIELDS[1]]: 'Description',
    [FIELDS[2]]: false,
    [FIELDS[3]]: false,
    [FIELDS[4]]: false,
    [FIELDS[5]]: {
        [FIELDS[3]]: false,
        [FIELDS[4]]: false,
    },
    [FIELDS[6]]: -1,
    [FIELDS[7]]: true,
};

const LOG = {
    CREATE: 'Could not create game',
    SAVE: 'Could not save game',
    DELETE: 'Could not delete game',
};

const TOAST = {
    SUCCESS: {
        CREATE: ' successfully created',
        SAVE: ' successfully saved',
        DELETE: ' successfully deleted',
    },
    ERROR: {
        CREATE:  'Could not create ',
        SAVE: 'Could not save ',
        DELETE: 'Could not delete ',
    },
};

export var dataTransform = function (data) {
    data = _.filter(data, item => !item.deleted);
    data = _.map(data, filterInputFields);
    data.unshift(NEW_GAME);
    return data;
}

export var filterInputFields = function (item, index) {
    var gameItem = {};

    _.forEach(item, (inputValue, inputType) => {
        if (typeof inputValue === 'object' && FIELDS.indexOf(inputType) !== -1) {
            gameItem[inputType] = {};
            _.forEach(inputValue, (inputValue_, inputType_) => {
                if (FIELDS.indexOf(inputType_) > -1) {
                    gameItem[inputType_] = inputValue_;
                    gameItem[inputType][inputType_] = inputValue_;
                }
            });
        } else {
            if (FIELDS.indexOf(inputType) !== -1) gameItem[inputType] = inputValue;
        }
    });
    
    gameItem.key = index;
    
    return gameItem;
};

export class GodModeGames extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: '',
            games: {},
            deleteTry: '',
            update: true,
            reset: '',
            changed: [],
        };
    }

    saveGame(item, gameId, create = false) {
        var postData = {};

        _.forEach(item, (inputValue, inputType) => {
            if (inputType === 'key') return;

            if (typeof inputValue === 'object') {
                postData[inputType] = {};
                _.forEach(inputValue, (inputValue_, inputType_) => {
                    postData[inputType][inputType_] = item[inputType_];
                });
            } else {
                postData[inputType] = inputValue;
            }
        });

        if (create) {
            HttpManager.POST({url: `${this.props.data._links.games.href}`},
                postData).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.CREATE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.CREATE}${item.title}: ${err.response.status} ${err.response.detail}`);
                    Log.log(LOG.CREATE, err, postData);
            });
        } else {
            HttpManager.PUT({url: `${this.props.data._links.games.href}/${gameId}`},
                postData).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.SAVE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.SAVE}${item.title}: ${err.response.status} ${err.response.detail}`);
                    Log.log(LOG.SAVE, err, postData);
            });
        }
    }

    saveAllGames() {
        _.forEach(this.state.games, (game, gameId) => {
            if (this.state.changed.indexOf(gameId) !== -1 && !game.newGame) {
                this.saveGame(game, gameId);
            }
        });
    }

    deleteGame(item, gameId) {
        if (this.state.deleteTry === gameId) {
            var postData = {
                game_id: gameId
            };

            HttpManager.DELETE({url: `${this.props.data._links.games.href}/${gameId}`},
                postData).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.DELETE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.DELETE}${item.title}: ${err.response.status} ${err.response.detail}`);
                    Log.log(LOG.DELETE, err, postData);
            });

            this.setState({ deleteTry: '' });
        } else {
            this.setState({ deleteTry: gameId });
        }
    }

    updateGameData(data) {
        var games = {};

        if (this.state.reset) {
            games = _.cloneDeep(this.state.games);
            games[this.state.reset] = _.find(data, item => {
                return item.game_id === this.state.reset;
            });
            this.setState({ games, reset: '' });
        }

        if (this.state.update) {
            _.forEach(data, item => {
                games[item.game_id] = item;
            });

            if (!_.isEqual(games, this.state.games)) {
                this.setState({ games, update: false });
            }
        }
    }

    toggleOpen(openGame, gameId) {
        this.setState({
            open: openGame ? gameId : '',
            deleteTry: '',
        });
    }

    renderInputField(inputValue, inputType, gameId, key) {
        var self = this;
        var games;
        var changed;

        if (NON_INPUTS.indexOf(inputType) !== -1) return;

        games = _.cloneDeep(this.state.games);
        changed = _.clone(this.state.changed);

        if (FIELD_TYPES[inputType] === 'checkbox') {
            return (
               <Input
                    type={FIELD_TYPES[inputType]}
                    label={FIELD_LABELS[inputType]}
                    checked={inputValue}
                    ref={`${inputType}-input`}
                    name={`${inputType}-input`}
                    key={key}
                    validate="required"
                    onChange={e => {
                        if (changed.indexOf(gameId) === -1) changed.push(gameId);
                        games[gameId][inputType] = e.target.checked;
                        self.setState({ games, changed });
                    }}
               />
            );
        }

        return (
           <Input
                className={FIELD_TYPES[inputType]}
                type={FIELD_TYPES[inputType]}
                label={FIELD_LABELS[inputType]}
                value={inputValue}
                ref={`${inputType}-input`}
                name={`${inputType}-input`}
                key={key}
                validate="required"
                onChange={e => {
                    if (changed.indexOf(gameId) === -1) changed.push(gameId);
                    games[gameId][inputType] = e.target.value
                    self.setState({ games, changed });
                }}
           />
        );
    }

    renderFlip(item) {
        var currentItem;
        var open;
        var text;
        var form;
        var title;

        if (!this.state.games || !this.state.games[item.game_id]) return null;

        currentItem = this.state.games[item.game_id];
        open = this.state.open === item.game_id || currentItem.newGame;
        text = open ? 'CLOSE' : 'EDIT';
        form = _.map(Object.keys(currentItem), (inputType, key) => {
            return this.renderInputField(currentItem[inputType], inputType, item.game_id, key);
        });
        title = currentItem.newGame ? 'CREATE GAME' :
            currentItem.title === '' ? '<BLANK>' : currentItem.title;

        return (
            <div className="item" key={currentItem.key}>
                <Panel header={title} className={ClassNames(
                        'item-panel',
                        'standard', {
                            open,
                            'new-game': currentItem.newGame,
                        }
                    )}
                >
                    <Form>
                        {form}
                        <Button
                            className="btn standard purple save-btn"
                            onClick={this.saveGame.bind(this, currentItem, item.game_id, currentItem.newGame)}
                        >
                            {currentItem.newGame ? 'CREATE' : 'SAVE'}
                        </Button>
                        <Button
                            className={ClassNames('btn', 'standard', 'green', 'reset-btn', {
                                hidden: currentItem.newGame
                            })}
                            onClick={() => {
                                this.setState({ reset: item.game_id });
                            }}
                        >
                            RESET
                        </Button>
                        <Button
                            className={ClassNames('btn', 'standard', 'purple', 'delete-btn', {
                                hidden: currentItem.newGame
                            })}
                            onClick={this.deleteGame.bind(this, currentItem, item.game_id)}
                        >
                            {this.state.deleteTry === item.game_id ? "ARE YOU SURE?" : "DELETE"}
                        </Button>
                    </Form>
                </Panel>
                <Button
                    className={ClassNames('btn', 'standard', 'green', 'edit-btn', {
                        hidden: currentItem.newGame
                    })}
                    onClick={this.toggleOpen.bind(this, !open, item.game_id)}
                >
                    {text}
                </Button>
            </div>
        );
    }

    render() {
        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        const BUTTONS = (
            <div>            
                <Button
                    className="btn standard purple save-all-btn"
                    onClick={this.saveAllGames.bind(this)}
                >
                    SAVE ALL UPDATED GAMES
                </Button>
                <Button
                    className="btn standard green reset-all-btn"
                    onClick={() => {
                        this.setState({ update: true });
                    }}
                >
                    RESET ALL
                </Button>
            </div>
        );

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                {BUTTONS}
                <GAME_WRAPPER transform={dataTransform}>
                    <FlipBoard
                        renderFlip={this.renderFlip.bind(this)}
                        updateParent={this.updateGameData.bind(this)}
                        alwaysUpdateParent
                        id="game-flip-board"
                        header={null}
                    />
                </GAME_WRAPPER>
                {BUTTONS}
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

