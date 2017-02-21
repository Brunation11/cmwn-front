import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import {Button, Input, Panel, Modal} from 'react-bootstrap';

import FlipBoard from 'components/flipboard';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import Form from 'components/form';
import 'routes/god_mode/flips.scss';
import IB_IDS from 'components/ib_ids';
import GLOBALS from 'components/globals';

import Layout from 'layouts/god_mode_two_col';

var mapStateToProps;
var Page;

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-flips';

const HEADINGS = {
    FLIPS: 'ACTIVE FLIPS:',
    CREATE_FLIP: 'Create New Flip',
    SAVE: 'SAVE',
    DELETE: 'DELETE',
    CONFIRM_DELETE: 'CONFIRM DELETE?',
    CREATE: 'CREATE',
    CREATE_SUCCESS: 'Flip Created Successfully',
    CREATE_FAILED: 'There was a problem creating your flip',
    SAVE_FAILED: 'There was a problem saving flip',
    SAVE_SUCCESS: 'Flip Saved Successfully',
    DELETE_FAILED: 'There was a problem deleting flip',
    DELETE_SUCCESS: 'Flip Deleted Successfully',
};

export class ManageFlips extends React.Component {
    constructor() {
        super();

        this.state = {
            flips: {},
            open: '',
            update: true,
            deleteTry: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.updateFlips(nextProps.data);
        }
    }

    saveFlip(item, flipId, newFlip = false) {
        var postData = {title: item.title, description: item.description};
        if (newFlip) {
            HttpManager.POST(
                this.props.link,
                postData
            ).then(() => {
                Toast.success(HEADINGS.CREATE_SUCCESS);
                this.toggleClose(false, flipId);
            }).catch(err => {
                Toast.error(HEADINGS.CREATE_FAILED);
                Log.log(HEADINGS.CREATE_FAILED, err, postData);
            });
            return;
        }

        HttpManager.PUT(
            `${this.props.link}/${flipId}`,
            postData
        ).then(() => {
            Toast.success(HEADINGS.SAVE_SUCCESS);
            this.toggleClose(false, flipId);
        }).catch(err => {
            Toast.error(HEADINGS.SAVE_FAILED);
            Log.log(HEADINGS.SAVE_FAILED, err, postData);
        });
    }

    deleteFlip(flipId) {
        if (this.state.deleteTry === flipId) {
            HttpManager.DELETE(
                `${this.props.link}/${flipId}`
            ).then(() => {
                Toast.success(HEADINGS.DELETE_SUCCESS);
                this.toggleClose(false, flipId);
            }).catch(err => {
                Toast.error(HEADINGS.DELETE_FAILED);
                Log.log(HEADINGS.DELETE_FAILED, err);
            });
            this.setState({deleteTry: ''});
            return;
        }
        this.setState({deleteTry: flipId});
    }

    renderFlip(item) {
        var res = this.renderPopover(item);
        var src = (IB_IDS.FLIPS[item.flipId] && IB_IDS.FLIPS[item.flipId].static) ?
            GLOBALS.MEDIA_URL + IB_IDS.FLIPS[item.flipId].static :
            GLOBALS.MEDIA_URL + IB_IDS.FLIPS.default;
        if (item.newFlip) {
            return (
                <div className="create-flip" key={item.flipId}>
                    <Button
                        onClick={this.toggleClose.bind(this, true, item.flipId)}
                        className="purple standard create-btn"
                    >
                        {HEADINGS.CREATE_FLIP}
                    </Button>
                    {res}
                    <div className="active-flip-title">{HEADINGS.FLIPS}</div>
                </div>
            );
        }
        return (
            <div className="edit-flip" key={item.flipId}>
                <img
                    ref={`img-ref-${item.flipId}`}
                    className="flip-image"
                    src={src}
                    alt={item.flipId}
                />
                <a onClick={this.toggleClose.bind(this, true, item.flipId)}>
                    {res}
                    <div className="flip-title">{item.title}</div>
                </a>
            </div>
        );
    }

    toggleClose(open, flipId) {
        this.setState({open: open ? flipId : ''});
    }

    renderPopover(item) {
        var flips = this.state.flips;
        var open = this.state.open === item.flipId;
        if (flips === {}) return null;

        return (
            <Modal
                className="flip-modal"
                show={open}
                onHide={this.toggleClose.bind(this, false, item.flipId)}
            >
                <Panel
                    className={ClassNames(
                        'item-panel',
                        'standard', {
                            'new-flip': item.newFlip,
                        }
                    )}
                    header={item.title === '' ? HEADINGS.CREATE_FLIP : item.title}
                >
                    <Form key={`form-${item.flipId}`}>
                        <Input
                            type="title"
                            label="title"
                            value={item.title}
                            validate="required"
                            placeholder="title"
                            onChange={e => {
                                flips[item.flipId].title = e.target.value;
                                this.setState({flips});
                            }}
                        />
                        <Input
                            type="description"
                            label="description"
                            value={item.description}
                            validate="required"
                            placeholder="description"
                            onChange={e => {
                                flips[item.flipId].description = e.target.value;
                                this.setState({flips});
                            }}
                        />
                        <Button
                            className="btn standard purple edit-btn"
                            onClick={this.saveFlip.bind(this, item, item.flipId, item.newFlip)}
                        >
                            {item.newFlip ? HEADINGS.CREATE : HEADINGS.SAVE}
                        </Button>
                        <Button
                            className={
                                ClassNames('btn', 'standard', 'purple', 'delete-btn', {hidden: item.newFlip})
                            }
                            onClick={this.deleteFlip.bind(this, item.flipId)}
                        >
                            {this.state.deleteTry === item.flipId ? HEADINGS.CONFIRM_DELETE : HEADINGS.DELETE}
                        </Button>
                    </Form>
                </Panel>
                <a
                    className="flip-close"
                    title="close"
                    onClick={this.toggleClose.bind(this, false, item.flipId)}
                >
                    X
                </a>
            </Modal>
        );
    }

    updateFlips(data) {
        var flips = {};

        if (this.state.update) {
            _.each(data, item => {
                flips[item.flip_id] = {
                    flipId: item.flip_id,
                    title: item.title,
                    description: item.description
                };
            });

            if (!_.isEqual(flips, this.state.flips)) {
                flips['new-flip'] = {flipId: 'new-flip', title: '', description: '', newFlip: true};
                this.setState({flips, update: false});
            }
        }
    }

    render() {
        var flips;
        if (!this.props.data) return null;

        flips = Object.values(this.state.flips);

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                <Panel header="Manage Flips" className="standard">
                    <div className="manage-flip-panel">
                        <FlipBoard
                            renderFlip={this.renderFlip.bind(this)}
                            data={flips}
                            id="game-flip-board"
                            updateParent={this.updateFlips.bind(this)}
                            alwaysUpdateParent
                            header={null}
                        />
                    </div>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    var link;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.flip) {
        loading = state.page.loading;
        data = state.page.data._embedded.flip;
        link = state.page.data._links.first.href;
        currentUser = state.currentUser;
    }

    return {
        data,
        link,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(ManageFlips);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
