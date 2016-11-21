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
    'coming_soon',
    'description',
    'desktop',
    'unity',
    'title',
];

const FIELD_TYPES = {
    [FIELDS[0]]: 'text',
    [FIELDS[1]]: 'checkbox',
    [FIELDS[2]]: 'textarea',
    [FIELDS[3]]: 'checkbox',
    [FIELDS[4]]: 'checkbox',
    [FIELDS[5]]: 'text',
};

const FIELD_LABELS = {
    [FIELDS[0]]: 'Game ID',
    [FIELDS[1]]: 'Coming Soon',
    [FIELDS[2]]: 'Description',
    [FIELDS[3]]: 'Desktop Only',
    [FIELDS[4]]: 'Unity',
    [FIELDS[5]]: 'Title',
};

var dataTransform = function (data) {
    var games = _.map(data, filterInputFields);
    return games;
}

var filterInputFields = function (item, index) {
    var gameItem = {};
    
    _.forEach(item, (inputValue, inputType) => {
        if (typeof inputValue === 'object') {
            _.forEach(inputValue, (inputValue_, inputType_) => {
                if (FIELDS.indexOf(inputType_) > -1) gameItem[inputType_] = inputValue_;
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
        };
    }

    submitGame(item) {
        var postData = {
            game_id: item.game_id,
            data: item,
        };
        HttpManager.POST({url: this.props.data._links.games.href},
            postData).then(() => {
                console.log(`${item.title} successfully updated`);
            }).catch(err => {
                console.log(`Could not post to ${item.title}`);
        });
    }

    deleteGame(item) {
        var postData = {
            game_id: item.game_id
        };
    }

    updateGameData(data) {
        var games = {};

        _.forEach(data, item => {
            games[item.game_id] = item;
        });

        if (!_.isEqual(games, this.state.games)) {
            this.setState({ games });
        }
    }

    toggleOpen(openGame, item) {
        this.setState({open: openGame ? item.game_id : ''});
    }

    renderInputField(inputValue, inputType, gameId, key) {
        var games = this.state.games;
        var self = this;

        if (FIELD_TYPES[inputType] === 'checkbox') {
            return (
               <Input
                    type={FIELD_TYPES[inputType]}
                    label={FIELD_LABELS[inputType]}
                    checked={games[gameId][inputType]}
                    ref={`${inputType}-input`}
                    name={`${inputType}-input`}
                    key={key}
                    validate="required"
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
                validate="required"
                onChange={e => {
                    games[gameId][inputType] = e.target.value
                    self.setState({games});
                }}
           />
        );
    }

    renderFlip(item) {
        var open;
        var text;
        var currentItem;
        var form;
        var title;

        if (!this.state.games[item.game_id]) return null;

        open = this.state.open === item.game_id;
        text = open ? 'CLOSE' : 'EDIT';
        currentItem = this.state.games[item.game_id] ? this.state.games[item.game_id] : item;
        form = _.map(Object.keys(currentItem), (inputType, key) => {
            return this.renderInputField(currentItem[inputType], inputType, item.game_id, key);
        });
        title = currentItem.title === '' ? '<BLANK>' : currentItem.title;

        return (
            <div className="item" key={currentItem.key}>
                <Panel header={title} className={ClassNames(
                        'item-panel',
                        'standard', {
                            open
                        }
                    )}
                >
                    <Form ref="formRef">
                        {form}
                        <br />
                        <Button
                            className="btn standard purple save-btn"
                            onClick={this.submitGame.bind(this, currentItem)}
                        >
                            SAVE
                        </Button>
                    </Form>
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
                <Button
                    className="btn standard purple save-all-btn"
                >
                    SAVE ALL
                </Button>
                <GAME_WRAPPER transform={dataTransform}>
                    <FlipBoard
                        renderFlip={this.renderFlip.bind(this)}
                        updateParent={this.updateGameData.bind(this)}
                        id="game-flip-board"
                        header={null}
                    />
                </GAME_WRAPPER>
                <Button
                    className="btn standard purple save-all-btn"
                >
                    SAVE ALL
                </Button>
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

