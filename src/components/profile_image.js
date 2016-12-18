import React from 'react';
import {Modal, ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Classnames from 'classnames';

import Cloudinary from 'components/cloudinary';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';
import History from 'components/history';

import 'components/profile_image.scss';

const COMPONENT_UNIQUE_IDENTIFIER = 'profile-image';
const PIC_ALT = 'Profile Picture';
const UPLOAD_ERROR = 'There was a problem uploading your image. Please refresh the page and try again.';
const MODERATION = 'Your image has been submitted for moderation and should appear shortly.';
const PENDINGHEADER = 'Woah there World Changer!';
const PENDING = ' We\'re reviewing your image and it should appear shortly. ' +
                'Other users will continue to see your last approved image until we\'ve reviewed this one.' +
                'To continue uploading a new image click ';
const NO_IMAGE = 'Looks like there was a problem displaying this users profile. ' +
                'Please refresh the page to try again.';

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
            this.setState({profileImage: this.props.data._embedded.image.url});
            this.setState({isModerated: this.props.data._embedded.image.is_moderated});
        } else {
            HttpManager.GET({
                url: (this.props.data._links.user_image.href),
                handleErrors: false
            })
            .then(res => {
                this.setState({profileImage: res.response.url});
            }).catch(e => {
                if (e.status === 404) {
                    //if a user has never uploaded an image, we expect a 404
                    this.setState({profileImage: GLOBALS.DEFAULT_PROFILE});
                } else {
                    Toast.error(NO_IMAGE);
                    Log.error(e, 'Image could not be extracted from user');
                }
            });
        }
    }

    startUpload(e) {
        var self = this;
        e.stopPropagation();
        Cloudinary.load((e_, err) => {
            if (err != null) {
                Toast.error(UPLOAD_ERROR);
            }
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
                if (error !== null) {
                    if (error.message === 'User closed widget') {
                        return;
                    }
                }
                self.setState({profileImage: result[0].secure_url});
                self.setState({isModerated: false});
                ('set', 'dimension6', 1);
                HttpManager.POST({url: this.props.data._links.user_image.href}, {
                    url: result[0].secure_url,
                    image_id: result[0].public_id
                }).then(() => {
                    Toast.error(MODERATION);
                }).catch(() => {
                    Toast.error(UPLOAD_ERROR);
                    Log.error(e, 'Failed image upload');
                });
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
            page: 'welcome',
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

    renderUploader() {
        return (
            <div className="welcome-container">
                <div className="left">
                    <span className="prompt-1">
                        CLICK ANYWHERE IN THIS BOX TO
                    </span>
                    <span className="prompt-2">
                        Upload or drag photo
                        <br />
                        from your computer
                    </span>
                    <button
                        className="upload-your-photo-btn"
                        onClick={this.startUpload.bind(this)}
                    />
                </div>
                <div className="right">
                    <button
                        className="pick-one-from-our-avatar-btn"
                        onClick={this.setPage.bind(this, 'avatar-selector')}
                    />
                </div>
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
                <button className="upload" onClick={this.showModal.bind(this)}>Upload Image</button>
            );
        } else {
            return (
                <ButtonToolbar>
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
                        <button
                            className="upload"
                        >
                            Upload Image
                        </button>
                    </OverlayTrigger>
                </ButtonToolbar>
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
