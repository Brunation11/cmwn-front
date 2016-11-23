import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import {Button, Input, Panel} from 'react-bootstrap';

import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Form from 'components/form';

import Layout from 'layouts/two_col';

import 'routes/god_mode/games.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'god-mode-games';

const GAME_WRAPPER = GenerateDataSource('games', PAGE_UNIQUE_IDENTIFIER);

const FIELDS = [
    'game_id',
    'title',
    'description',
    'coming_soon',
    'desktop',
    'unity',
];

const FIELD_TYPES = {
    [FIELDS[0]]: 'text',
    [FIELDS[1]]: 'text',
    [FIELDS[2]]: 'textarea',
    [FIELDS[3]]: 'checkbox',
    [FIELDS[4]]: 'checkbox',
    [FIELDS[5]]: 'checkbox',
};

const FIELD_LABELS = {
    [FIELDS[0]]: 'Game ID',
    [FIELDS[1]]: 'Title',
    [FIELDS[2]]: 'Description',
    [FIELDS[3]]: 'Coming Soon',
    [FIELDS[4]]: 'Desktop Only',
    [FIELDS[5]]: 'Unity',
};

const NEW_GAME = {
    [FIELDS[0]]: 'new_game',
    [FIELDS[1]]: 'New Game',
    [FIELDS[2]]: 'Description',
    [FIELDS[3]]: false,
    [FIELDS[4]]: false,
    [FIELDS[5]]: false,
    meta: {
        [FIELDS[4]]: false,
        [FIELDS[5]]: false,
    },
    key: -1,
    newGame: true,
};

var dataTransform = function (data) {
    var games = _.map(data, filterInputFields);
    games.unshift(NEW_GAME);
    return games;
}

var filterInputFields = function (item, index) {
    var gameItem = {};

    _.forEach(item, (inputValue, inputType) => {
        if (typeof inputValue === 'object') {
            gameItem[inputType] = {};
            _.forEach(inputValue, (inputValue_, inputType_) => {
                if (FIELDS.indexOf(inputType_) > -1) {
                    gameItem[inputType_] = inputValue_;
                    gameItem[inputType][inputType_] = inputValue_;
                }
            });
        } else {
            if (FIELDS.indexOf(inputType) > -1) gameItem[inputType] = inputValue;
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
        };
    }

    saveGame(item, create = false) {
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
            // TODO PUSH new game
            console.log('making new game');
            console.log(item);
        } else {
            HttpManager.PUT({url: `${this.props.data._links.games.href}/${item.game_id}`},
                postData).then(() => {
                    console.log(`${item.title} successfully saved`);
                }).catch(err => {
                    console.log(`Could not post to ${item.title}`);
            });
        }
    }

    saveAllGames() {
        _.forEach(this.state.games, game => {
            if (!game.newGame) this.saveGame(game);
        });
    }

    deleteGame(item) {
        if (this.state.deleteTry === item.game_id) {
            var postData = {
                game_id: item.game_id
            };
            console.log('deleting ' + this.state.deleteTry);
            //HttpManager.DELETE({url: `${this.props.data._links.games.href}/${item.game_id}`},
            //    postData).then(() => {
            //        console.log(`${item.title} successfully deleted`);
            //    }).catch(err => {
            //        console.log(`Could not delete ${item.title}`);
            //});
            this.setState({ deleteTry: '' });
        } else {
            this.setState({ deleteTry: item.game_id });
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

    toggleOpen(openGame, item) {
        this.setState({
            open: openGame ? item.game_id : '',
            deleteTry: '',
        });
    }

    renderInputField(inputValue, inputType, gameId, key) {
        var self = this;
        var games;

        if (inputType === 'key' || inputType === 'newGame' || typeof inputValue === 'object') return;

        games = _.cloneDeep(this.state.games);

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
                ref={`${inputType}-input`}
                name={`${inputType}-input`}
                key={key}
                validate="required"
                onChange={e => {
                    games[gameId][inputType] = e.target.value
                    self.setState({ games });
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

        if (!this.state.games[item.game_id]) return null;

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
                            onClick={this.saveGame.bind(this, currentItem, currentItem.newGame)}
                        >
                            {currentItem.newGame ? 'CREATE' : 'SAVE'}
                        </Button>
                        <Button
                            className={ClassNames('btn', 'standard', 'green', 'reset-btn', {
                                hidden: currentItem.newGame
                            })}
                            onClick={() => {
                                this.setState({ reset: currentItem.game_id });
                            }}
                        >
                            RESET
                        </Button>
                        <Button
                            className={ClassNames('btn', 'standard', 'purple', 'delete-btn', {
                                hidden: currentItem.newGame
                            })}
                            onClick={this.deleteGame.bind(this, currentItem)}
                        >
                            {this.state.deleteTry === currentItem.game_id ? "ARE YOU SURE?" : "DELETE"}
                        </Button>
                    </Form>
                </Panel>
                <Button
                    className={ClassNames('btn', 'standard', 'green', 'edit-btn', {
                        hidden: currentItem.newGame
                    })}
                    onClick={this.toggleOpen.bind(this, !open, currentItem)}
                >
                    {text}
                </Button>
            </div>
        );
    }

    render() {
        if (!this.props.data) return null;

        const BUTTONS = (
            <div>            
                <Button
                    className="btn standard purple save-all-btn"
                    onClick={this.saveAllGames.bind(this)}
                >
                    SAVE ALL EXISTING GAMES
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
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
                {BUTTONS}
                <GAME_WRAPPER transform={dataTransform}>
                    <FlipBoard
                        renderFlip={this.renderFlip.bind(this)}
                        updateParent={this.updateGameData.bind(this)}
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

