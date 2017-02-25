/* eslint-disable max-lines*/
import React from 'react';
import {Modal, ButtonToolbar, OverlayTrigger, Popover, Button} from 'react-bootstrap';
import Classnames from 'classnames';
import _ from 'lodash';

import Cloudinary from 'components/cloudinary';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';
import History from 'components/history';
import Shortid from 'shortid';

import 'components/profile_image.scss';

const COMPONENT_UNIQUE_IDENTIFIER = 'profile-image';

const PIC_ALT = 'Profile Picture';

const PENDINGHEADER = 'Woah there World Changer!';
const PENDING = ' We\'re reviewing your image and it should appear shortly. ' +
                'Other users will continue to see your last approved image until we\'ve reviewed this one.' +
                'To continue uploading a new image click ';

const DEFAULT_IMGS = {
    BW: '4795ea6a87f34d517f750669c67a5377',
    CLR: '85a95f88575463336eb36e55ed044c40'
};

const ERRORS = {
    REFRESH: 'Looks like there was a problem displaying this users profile.' +
             'Please refresh the page to try again.',
    NO_IMAGE: 'Image could not be extracted from user',
    NO_DEFAULTS: 'Looks like there was a problem displaying our default collection.',
    MODERATION: 'Your image has been submitted for moderation and should appear shortly.',
    UPLOAD_ERROR: 'There was a problem uploading your image. Please refresh the page and try again.',
    FAILED_UPLOAD: 'Failed image upload'
};

export default class Image extends React.Component {
    constructor() {
        super();

        this.state = {
            profileImage: GLOBALS.DEFAULT_PROFILE,
            isModerated: false,
            page: 'welcome'
        };
    }

    componentDidMount() {
        if (this.props.data._embedded.image) {
            this.setState({
                profileImage: this.props.data._embedded.image.url,
                isModerated: this.props.data._embedded.image.is_moderated
            });
        } else {
            HttpManager.GET({
                url: (this.props.data._links.user_image.href),
                handleErrors: false
            }).then(res => {
                this.setState({
                    profileImage: res.response.url
                });
            }).catch(e => {
                //if a user has never uploaded an image, we expect a 404
                if (e.status === 404) {
                    this.setState({
                        profileImage: GLOBALS.DEFAULT_PROFILE
                    });
                } else {
                    Toast.error(ERRORS.REFRESH);
                    Log.error(e, ERRORS.NO_IMAGE);
                }
            });
        }
    }

    getDefaultImages() {
        // get black and white default images
        HttpManager.GET({
            url: `${GLOBALS.API_URL}media/${DEFAULT_IMGS.BW}`
        }).then((res) => {
            this.setState({
                defaultsBW: res.response._embedded.items
            });
        }).catch((e) => {
            Toast.error(ERRORS.NO_DEFAULTS);
        });

        // get color default images
        HttpManager.GET({
            url: `${GLOBALS.API_URL}media/${DEFAULT_IMGS.CLR}`
        }).then((res) => {
            this.setState({
                defaultsCLR: res.response._embedded.items
            });
        }).catch(() => {
            Toast.error(ERRORS.NO_DEFAULTS);
        });
    }

    upload(e, postURL, imageURL, imageID) {
        /* eslint-disable camelcase*/
        HttpManager.POST({
            url: postURL
        }, {
            url: imageURL,
            image_id: imageID
        }).then(() => {
            self.setState({
                profileImage: imageURL,
                isModerated: false
            });

            Toast.error(ERRORS.MODERATION);
        }).catch(() => {
            Toast.error(ERRORS.UPLOAD_ERROR);
            Log.error(e, ERRORS.FAILED_UPLOAD);
        });
        /* eslint-enable camelcase*/
    }

    cloudinaryUpload(e) {
        var postURL = this.props.data._links.user_image.href;
        var imageURL;
        var imageID;

        e.stopPropagation();

        Cloudinary.load((e_, err) => {
            if (err != null) Toast.error(ERRORS.UPLOAD_ERROR);
            /* eslint-disable camelcase*/
            Cloudinary.instance.openUploadWidget({
                cloud_name: GLOBALS.CLOUDINARY_CLOUD_NAME || 'changemyworldnow',
                upload_preset: GLOBALS.CLOUDINARY_UPLOAD_PRESET || 'public-profile-image',
                multiple: false,
                resource_type: 'image',
                cropping: 'server',
                gravity: 'custom',
                cropping_aspect_ratio: 1,
                theme: 'minimal',
            }, (error, result) => {
                if (error !== null && error.message === 'User closed widget') return;

                imageURL = result[0].secure_url;
                imageID = result[0].public_id;

                ('set', 'dimension6', 1);

                this.upload(e, postURL, imageURL, imageID);
            });
            /* eslint-enable camelcase */
        });
    }

    defaultUpload(e) {
        var postURL = this.props.data._links.user_image.href;
        var imageURL = _.get(this.state.defaultsCLR, ['name', this.state.selected]).src;
        var imageID = imageURL.replace('.png', '');

        e.stopPropagation();

        this.upload(e, postURL, imageURL, imageID);
    }

    showModal() {
        this.getDefaultImages();
        this.setState({
            uploaderOn: true
        });
    }

    hideModal() {
        this.setState({
            uploaderOn: false,
            page: 'welcome'
        });
    }

    setPage(page) {
        this.setState({
            page: page
        });
    }

    attemptNavigate() {
        if (this.props.data.user_id === this.props.currentUser.user_id ||
            (this.props.data && this.props.data.user_id === this.props.currentUser.user_id)) {
            History.push('/profile');
        }
    }

    renderImage(url) {
        var style = {'backgroundImage': `url(${url})`};
        return (
             <div
                onClick={this.attemptNavigate}
                className="profile-pic"
                alt={PIC_ALT}
                style={style}
            >
                 {PIC_ALT}
            </div>
        );
    }

    renderDesktopWelcome() {
        return (
            <div className="desktop welcome-container">
                <div className="left">
                    <span className="prompt-1">
                        CLICK ANYWHERE IN THIS BOX TO
                    </span>
                    <span className="prompt-2">
                        Upload or drag photo
                        <br />
                        from your computer
                    </span>
                    <Button
                        className="upload-your-photo-btn"
                        onClick={this.cloudinaryUpload.bind(this)}
                    />
                </div>
                <div className="right">
                    <Button
                        className="pick-one-from-our-avatar-btn"
                        onClick={this.setPage.bind(this, 'select-default')}
                    />
                </div>
            </div>
        );
    }

    renderMobileWelcome() {
        return (
            <div className="mobile welcome-container">
                <span className="header">
                    Profile Picture
                </span>
                <Button
                    className="upload-your-photo-btn"
                    onClick={this.cloudinaryUpload.bind(this)}
                />
                <Button
                    className="pick-one-from-our-avatar-btn"
                    onClick={this.setPage.bind(this, 'select-default')}
                />
                <Button
                    className="profile-btn"
                    onClick={this.hideModal.bind(this)}
                >
                    SWIPE DOWN TO CANCEL,
                    <br />
                    AND GO BACK TO YOUR PROFILE PAGE.
                </Button>
            </div>
        );
    }

    renderDesktopSelectDefault() {
        return (
            <div className="desktop select-default-container">
                <div className="avatar-container">
                    {_.map(this.state.defaultsBW, (value) => {
                        return (
                            <div
                                onClick={() => {
                                    this.setState({
                                        selected: value.name
                                    });
                                }}
                                className={Classnames(
                                    `avatar ${value.name}`,
                                    {
                                        disable: this.state.selected === value.name
                                    }
                                )}
                                key={Shortid.generate()}
                            >
                                <img
                                    className="clr"
                                    src={_.find(this.state.defaultsCLR, ['name', value.name])}
                                />
                                <img
                                    className="bw"
                                    src={value.src}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="prompt-container">
                    <span className="prompt">
                        Choose which photo you would like,
                    </span>
                    <br />
                    <span className="prompt">
                        and click <strong>confirm</strong> to save it.
                    </span>
                    <br />
                    <span className="prompt disclaimer">
                        (DESKTOP ONLY)
                    </span>
                </div>
                <Button
                    className="confirm-btn"
                    onClick={this.setPage.bind(this, 'confirm')}
                    disabled={!this.state.selected}
                />
                <Button className="cancel-btn"
                    onClick={this.setPage.bind(this, 'welcome')}
                />
            </div>
        );
    }

    renderMobileSelectDefault() {
        var self = this;
        var currentOption = self.state.defaultsBW[self.state.currentOption || 0];

        return (
            <div className="mobile select-default-container">
                <div className="avatar-container">
                    <div
                        className={`avatar ${currentOption.name}`}
                        onClick={() => {
                            self.setState({
                                selected: currentOption.name
                            });
                        }}
                    >
                        <img
                            className="clr animated"
                            src={currentOption.src}
                        />
                    </div>
                    <Button
                        className="prev-btn"
                        onClick={() => {
                            if (_.get(self, 'state.currentOption', 0) > 0) {
                                self.setState({
                                    currentOption: _.get(self, 'state.currentOption', 0) - 1,
                                    selected: currentOption.name
                                });
                            }
                        }}
                    />
                    <Button
                        className="next-btn"
                        onClick={() => {
                            if (_.get(self, 'state.currentOption', 0) < self.state.defaultsBW.length) {
                                self.setState({
                                    currentOption: _.get(self, 'state.currentOption', 0) + 1,
                                });
                            }
                        }}
                    />
                </div>
                <Button
                    className="confirm-btn"
                    onClick={() => {
                        this.setState({selected: currentOption.name});
                        self.setPage.call(self, 'confirm');
                    }}
                />
                <Button className="cancel-btn"
                    onClick={self.setPage.bind(self, 'welcome')}
                />
            </div>
        );
    }

    renderDesktopConfirm() {
        return (
            <div className="desktop confirm-container">
                <div className="left">
                    <span className="header">
                        REVIEW
                    </span>
                    <span className="prompt-1">
                        YOUR NEW PROFILE PHOTO
                    </span>
                    <img
                        className="selected-avatar"
                        src={_.find(this.state.defaultsBW, ['name', this.state.selected]).src}
                    />
                    <span className="prompt-2">
                        USERNAME HERE
                    </span>
                </div>
                <div className="right">
                    <span className="header">
                        CONFIRM
                    </span>
                    <Button
                        className="looks-great-btn"
                        onClick={this.defaultUpload.bind(this)}
                    />
                    <Button
                        className="change-my-mind-btn"
                        onClick={this.setPage.bind(this, 'select-default')}
                    />
                    <Button
                        className="back-to-upload-btn"
                        onClick={(e) => {
                            this.setPage.call(this, 'welcome');
                            this.cloudinaryUpload.call(this, e);
                        }}
                    />
                </div>
            </div>
        );
    }

    renderMobileConfirm() {
        return (
            <div className="mobile confirm-container">
                <span className="header">
                    Are you sure?
                </span>
                <img
                    className="selected-avatar"
                    src={_.find(this.state.defaultsBW, ['name', this.state.selected]).src}
                />
                <Button
                    className="confirm-btn"
                    onClick={this.defaultUpload.bind(this)}
                />
                <Button className="cancel-btn"
                    onClick={this.setPage.bind(this, 'select-default')}
                />
            </div>
        );
    }

    renderWelcome() {
        return (
            <div>
                {this.renderDesktopWelcome()}
                {this.renderMobileWelcome()}
            </div>
        );
    }

    renderSelectDefault() {
        return (
            <div>
                {this.renderDesktopSelectDefault()}
                {this.renderMobileSelectDefault()}
            </div>
        );
    }

    renderConfirm() {
        return (
            <div>
                {this.renderDesktopConfirm()}
                {this.renderMobileConfirm()}
            </div>
        );
    }

    renderUploader() {
        var page;

        if (this.state.page === 'select-default') {
            page = this.renderSelectDefault;
        } else if (this.state.page === 'confirm') {
            page = this.renderConfirm;
        } else {
            page = this.renderWelcome;
        }

        return (
            <div>
                <Button
                    className="close-modal-btn"
                    onClick={this.hideModal.bind(this)}
                >
                    <span className="label"><strong>TAP TO KEEP</strong> MY CURRENT PROFILE PICTURE</span>
                </Button>
                {page.call(this)}
            </div>
        );
    }

    renderUploadButton() {
        if (this.props.data.user_id !== this.props.currentUser.user_id ||
            (this.props.data && this.props.data.user_id !== this.props.currentUser.user_id)) {
            return null;
        }
        if ((this.state.profileImage === GLOBALS.DEFAULT_PROFILE) || this.state.isModerated) {
            return (
                <Button className="upload" onClick={this.showModal.bind(this)}>Upload Image</Button>
            );
        } else {
            return (
                <buttonToolbar>
                    <OverlayTrigger
                        trigger="click"
                        rootClose
                        placement="bottom"
                        overlay={
                            <Popover
                                className="profile-image-popover"
                                id="upload"
                            >
                                <strong>
                                    {PENDINGHEADER}
                                    <br />
                                </strong>
                                {PENDING}
                                <a onClick={this.showModal.bind(this)}>
                                    here.
                                </a>
                            </Popover>
                        }
                    >
                        <Button
                            className="upload"
                        >
                            Upload Image
                        </Button>
                    </OverlayTrigger>
                </buttonToolbar>
            );
        }
    }

    render() {
        return (
            <div
                className={Classnames(
                    COMPONENT_UNIQUE_IDENTIFIER,
                    {
                        'link-below': this.props['link-below']
                    }
                )}
            >
                <Modal
                    className={`profile-image-uploader-modal ${this.state.page}`}
                    show={this.state.uploaderOn}
                    onHide={this.hideModal.bind(this)}
                    keyboard={false}
                    backdrop="static"
                    id="profile-image-uploader-modal"
                >
                    <Modal.Body>
                        {this.renderUploader.call(this)}
                    </Modal.Body>
                </Modal>

                {this.renderImage(this.state.profileImage)}
                {this.renderUploadButton()}
            </div>
        );
    }
}
