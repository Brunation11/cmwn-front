/* eslint-disable max-lines*/
import React from 'react';
import {Modal, OverlayTrigger, Popover, Button} from 'react-bootstrap';
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
    CLR: 'e7f29f11fbaf7da8ac1d19ab2cea34db'
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
            page: 'welcome',
            defaultsCLR: []
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
                    profileImage: res.response.url,
                    isModerated: res.response.is_moderated
                });
            }).catch(e => {
                // if a user has never uploaded an image, we expect a 404
                if (e.status === 404) {
                    this.setState({
                        setDefault: true
                    });
                } else {
                    Toast.error(ERRORS.REFRESH);
                    Log.error(e, ERRORS.NO_IMAGE);
                }
            });
        }
        this.getDefaultCLRImages();
    }

    getDefaultCLRImages() {
        var animal;
        var defaultAvatar;
        var imageURL;
        var imageID;

        // get color default images
        HttpManager.GET({
            url: `${GLOBALS.API_URL}media/${DEFAULT_IMGS.CLR}`
        }).then((res) => {
            if (this.state.setDefault) {
                animal = _.replace(this.props.currentUser.username, /\d+/, '').split('-').pop();
                defaultAvatar = _.find(res.response._embedded.items, function (avatar) {
                    return _.replace(avatar.name, /\d+/, '') === animal;
                });
                imageURL = _.find(res.response._embedded.items, ['name', defaultAvatar.name]).thumb;
                imageID = imageURL.replace('.png', '').replace('jpg', '').split('/').pop();
                this.upload(imageURL, imageID);
            }

            this.setState({
                defaultsCLR: res.response._embedded.items,
                imageURL: imageURL,
                imageID: imageID,
                isModerated: defaultAvatar ? true : this.state.isModerated
            });
        }).catch(() => {
            Toast.error(ERRORS.NO_DEFAULTS);
        });
    }

    upload(imageURL, imageID) {
        var postURL = this.props.data._links.user_image.href;
        /* eslint-disable camelcase*/
        HttpManager.POST({url: postURL}, {
            url: imageURL,
            image_id: imageID
        }).then(() => {
            this.setState({
                profileImage: imageURL,
                isModerated: this.state.isModerated
            });
            if (!this.state.setDefault) Toast.error(ERRORS.MODERATION);
            this.hideModal();
        }).catch((e) => {
            Toast.error(ERRORS.UPLOAD_ERROR);
            Log.error(e, ERRORS.FAILED_UPLOAD);
        });
        /* eslint-enable camelcase*/
    }

    cloudinaryUpload(e) {
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

                ('set', 'dimension6', 1);

                this.setState({
                    imageURL: result[0].secure_url,
                    imageID: result[0].public_id,
                    setDefault: false,
                    isModerated: false
                });

                this.setPage('confirm');
            });
            /* eslint-enable camelcase */
        });
    }

    showModal() {
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

    getID(src) {
        return src.replace('.png', '').replace('jpg', '').split('/').pop();
    }

    renderImage(url) {
        var style = {'backgroundImage': `url(${url})`};
        return (
             <div
                onClick={this.attemptNavigate.bind(this)}
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
                        Upload photo or drag photo
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
                    {_.map(this.state.defaultsCLR, (value) => {
                        let color = _.find(this.state.defaultsCLR, ['name', value.name]);
                        if (!color) return null;
                        return (
                            <div
                                onClick={() => {
                                    if (this.state.selected && value.name === this.state.selected) {
                                        this.setState({
                                            selected: '',
                                            imageURL: '',
                                            imageID: ''
                                        });
                                    } else {
                                        this.setState({
                                            selected: value.name,
                                            imageURL: color.thumb,
                                            imageID: this.getID(color.src),
                                            setDefault: true,
                                            isModerated: true
                                        });
                                    }
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
                                    src={color.src}
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
                >
                    CONFIRM
                </Button>
                <Button className="cancel-btn"
                    onClick={this.setPage.bind(this, 'welcome')}
                >
                    CANCEL
                </Button>
            </div>
        );
    }

    renderMobileSelectDefault() {
        var self = this;
        var currentOption = self.state.defaultsCLR[self.state.currentOption || 0];

        if (!currentOption) return null;

        return (
            <div className="mobile select-default-container">
                <div className="avatar-container">
                    <div
                        className={`avatar ${currentOption.name}`}
                        onClick={() => {
                            self.setState({
                                selected: currentOption.name,
                                imageURL: currentOption.src,
                                imageID: this.getID(currentOption.src),
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
                                    currentOption: _.get(self, 'state.currentOption', 0) - 1
                                });
                            }
                        }}
                    />
                    <Button
                        className="next-btn"
                        onClick={() => {
                            if (_.get(self, 'state.currentOption', 0) < self.state.defaultsCLR.length) {
                                self.setState({
                                    currentOption: _.get(self, 'state.currentOption', 0) + 1
                                });
                            }
                        }}
                    />
                </div>
                <Button
                    className="confirm-btn"
                    onClick={() => {
                        this.setState({
                            selected: currentOption.name,
                            imageURL: currentOption.src,
                            imageID: this.getID(currentOption.src),
                            setDefault: true,
                            isModerated: true
                        });
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
                        src={this.state.imageURL}
                    />
                    <span className="prompt-2">
                        {this.props.currentUser.username.toUpperCase()}
                    </span>
                </div>
                <div className="right">
                    <span className="header">
                        CONFIRM
                    </span>
                    <Button
                        className="looks-great-btn"
                        onClick={this.upload.bind(this, this.state.imageURL, this.state.imageID)}
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
                    src={this.state.imageURL}
                />
                <Button
                    className="confirm-btn"
                    onClick={this.upload.bind(this, this.state.imageURL, this.state.imageID)}
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
