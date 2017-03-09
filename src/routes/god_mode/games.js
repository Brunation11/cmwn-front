import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';
import {Button, Input, Panel} from 'react-bootstrap';
import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';
import HttpManager from 'components/http_manager';
import Paginator from 'components/paginator';
import Toast from 'components/toast';
import Log from 'components/log';
import Form from 'components/form';
import Layout from 'layouts/god_mode_two_col';
import 'routes/god_mode/games.scss';

var mapStateToProps;
var Page;

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-games';

const GAME_WRAPPER = GenerateDataSource('games_deleted', PAGE_UNIQUE_IDENTIFIER);

export const FIELDS = [
    'title',
    'description',
    'coming_soon',
    'desktop',
    'unity',
    'zipcodes',
    'global',
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
    'deletedGame',
    'undelete',
];

const FIELD_TYPES = {
    [FIELDS[0]]: 'text',
    [FIELDS[1]]: 'textarea',
    [FIELDS[2]]: 'checkbox',
    [FIELDS[3]]: 'checkbox',
    [FIELDS[4]]: 'checkbox',
    [FIELDS[5]]: 'taginput',
    [FIELDS[6]]: 'checkbox',
};

const FIELD_LABELS = {
    [FIELDS[0]]: 'Title',
    [FIELDS[1]]: 'Description',
    [FIELDS[2]]: 'Desktop Only',
    [FIELDS[3]]: 'Unity',
    [FIELDS[4]]: 'Coming Soon',
    [FIELDS[5]]: 'Zip Codes:',
    [FIELDS[6]]: 'Visible to everyone',
};

const NEW_GAME = {
    [FIELDS[0]]: '',
    [FIELDS[1]]: '',
    [FIELDS[2]]: false,
    [FIELDS[3]]: false,
    [FIELDS[4]]: false,
    [FIELDS[5]]: [],
    [FIELDS[6]]: false,
    [FIELDS[7]]: {
        [FIELDS[3]]: false,
        [FIELDS[4]]: false,
        [FIELDS[5]]: [],
    },
    [FIELDS[8]]: -1,
    [FIELDS[9]]: true,
};

const LOG = {
    CREATE: 'Could not create game',
    SAVE: 'Could not save game',
    DELETE: 'Could not delete game',
};

const HEADINGS = {
    ACTIVE: 'ACTIVE GAMES :',
    DELETED: 'DELETED GAMES :',
    DELETE: 'DELETE',
    CONFIRM: 'ARE YOU SURE?',
};

const TOAST = {
    SUCCESS: {
        CREATE: ' successfully created',
        SAVE: ' successfully saved',
        DELETE: ' successfully deleted',
    },
    ERROR: {
        CREATE: 'Could not create ',
        SAVE: 'Could not save ',
        DELETE: 'Could not delete ',
    },
};

export var dataTransform = function (data, deleted = false) {
    if (!data) return [];
    switch (deleted) {
        case true:
            data = _.filter(data, item => item.deleted);
            break;
        default:
            data = _.filter(data, item => !item.deleted);
    }

    data = _.map(data, filterInputFields);
    return data;
};

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

    if (item.deleted) {
        gameItem.deletedGame = true;
    }
    gameItem.undelete = false;
    gameItem.key = index;

    if (!gameItem.zipcodes) {
        gameItem.zipcodes = [];
    }

    return gameItem;
};

export class GodModeGames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: '',
            games: {},
            deleteTry: '',
            update: 3,
            reset: '',
        };
    }

    saveGame(item, gameId, create = false) {
        var postData = {};
        var game;

        _.forEach(item, (inputValue, inputType) => {
            if (inputType === 'key') return;

            if (inputType === 'zipcodes') {
                inputValue = _.reduce(inputValue, function (a, zipcode) {
                    if (zipcode.text) {
                        a.push(zipcode.text);
                    }
                    return a;
                }, []);
                postData.meta.zipcodes = inputValue;
            } else if (typeof inputValue === 'object') {
                postData[inputType] = {};
                _.forEach(inputValue, (inputValue_, inputType_) => {
                    postData[inputType][inputType_] = item[inputType_];
                });
            } else {
                postData[inputType] = inputValue;
            }
        });

        if (create) {
            HttpManager.POST({url: `${this.props.data._links.first.href}`},
                postData).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.CREATE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.CREATE}${item.title}:
                        ${err.response.status} ${err.response.detail}`);
                    Log.log(LOG.CREATE, err, postData);
                });
        } else {
            game = _.find(this.props.data._embedded.game, v => v.game_id === gameId);
            HttpManager.PUT({url: game._links.self.href},
                postData).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.SAVE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.SAVE}${item.title}:
                        ${err.response.status} ${err.response.detail}`);
                    Log.log(LOG.SAVE, err, postData);
                });
        }
    }

    deleteGame(item, gameId) {
        var postData;
        var game = _.find(this.props.data._embedded.game, v => v.game_id === gameId);
        if (this.state.deleteTry === gameId) {
            HttpManager.DELETE(
                    game._links.self.href,
                ).then(() => {
                    Toast.success(`${item.title}${TOAST.SUCCESS.DELETE}`);
                }).catch(err => {
                    Toast.error(`${TOAST.ERROR.DELETE}${item.title}:
                        ${err.response.status} ${err.response.detail}`);
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

        if (this.state.update !== 0) {
            games = _.cloneDeep(this.state.games);
            _.forEach(data, item => {
                var tags = [];

                if (item.meta && item.meta.zipcodes) {
                    tags = _.map(item.meta.zipcodes, (zipcode, index) => {
                        return {id: index + 1, text: zipcode};
                    });
                }
                if (_.has(item, 'asMutable')) {
                    item = item.asMutable({deep: true});
                }
                item.zipcodes = tags;
                games[item.game_id] = item;
            });

            if (!_.isEqual(games, this.state.games)) {
                this.setState({ games, update: this.state.update - 1 });
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

        if (NON_INPUTS.indexOf(inputType) !== -1) return;

        games = _.cloneDeep(this.state.games);

        if (FIELD_TYPES[inputType] === 'taginput') {
            return (
                <div className="zipcode" key={key}>
                    <label className="control-label">
                        {FIELD_LABELS[inputType]}
                    </label>
                    <ReactTags
                        tags={inputValue}
                        handleDelete={(n) => {
                            games[gameId][inputType].splice(n, 1);
                            self.setState({ games });
                        }}
                        handleAddition={(tag) => {
                            var tags = games[gameId][inputType];
                            tags.push({id: tags.length + 1, text: tag});
                            games[gameId][inputType] = tags;
                            self.setState({ games });
                        }}
                    />
                </div>
            );
        }

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
                        games[gameId][inputType] = e.target.checked;
                        self.setState({ games });
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
                placeholder={inputType}
                ref={`${inputType}-input`}
                name={`${inputType}-input`}
                key={key}
                validate="required"
                onChange={e => {
                    games[gameId][inputType] = e.target.value;
                    self.setState({ games });
                }}
           />
        );
    }

    renderDeleteButton(item) {
        var currentItem = _.has(item, 'asMutable') ? item.asMutable() : item;

        currentItem.undelete = true;
        if (item.deletedGame) {
            return (
                <Button
                    className="btn standard purple save-btn"
                    onClick={this.saveGame.bind(this, currentItem, item.game_id, false)}
                >
                    {'UNDELETE'}
                </Button>
            );
        }
        return (
            <Button
                className={ClassNames('btn', 'standard', 'purple', 'delete-btn', {
                    hidden: currentItem.newGame
                })}
                onClick={this.deleteGame.bind(this, currentItem, item.game_id, false)}
            >
                {this.state.deleteTry === item.game_id ? HEADINGS.CONFIRM : HEADINGS.DELETE}
            </Button>
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
                        {this.renderDeleteButton(item)}
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

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                <FlipBoard
                    renderFlip={this.renderFlip.bind(this)}
                    data={[NEW_GAME]}
                    id="game-flip-board"
                    updateParent={this.updateGameData.bind(this)}
                    alwaysUpdateParent
                    header={null}
                />

                <div className="heading">
                    {HEADINGS.ACTIVE}
                </div>
                <GAME_WRAPPER transform={dataTransform}>
                    <Paginator>
                        <FlipBoard
                            renderFlip={this.renderFlip.bind(this)}
                            updateParent={this.updateGameData.bind(this)}
                            alwaysUpdateParent
                            id="game-flip-board"
                            header={null}
                        />
                    </Paginator>
                </GAME_WRAPPER>

                <div className="heading">
                    {HEADINGS.DELETED}
                </div>
                <GAME_WRAPPER
                    transform={data => { return (dataTransform(data, true)); }}
                    renderNoData={() => <div>No Deleted Games</div>}
                >
                    <FlipBoard
                        renderFlip={this.renderFlip.bind(this)}
                        updateParent={this.updateGameData.bind(this)}
                        alwaysUpdateParent
                        id="deleted-game-flip-board"
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
