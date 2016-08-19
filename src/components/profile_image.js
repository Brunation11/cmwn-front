import React from 'react';
import {ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Classnames from 'classnames';

import Cloudinary from 'components/cloudinary';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';
import History from 'components/history';

import 'components/profile_image.scss';

const PIC_ALT = 'Profile Picture';
const UPLOAD_ERROR = 'There was a problem uploading your image. Please refresh the page and try again.';
const MODERATION = 'Your image has been submitted for moderation and should appear shortly.';
const PENDINGHEADER = 'Woah there World Changer!';
const PENDING = ' We\'re reviewing your image and it should appear shortly. ' +
                'Other users will continue to see your last approved image until we\'ve reviewed this one.' +
                'To continue uploading a new image click ';
const NO_IMAGE = 'Looks like there was a problem displaying this users profile. ' +
                'Please refresh the page to try again.';

export var Image = React.createClass({
    getInitialState: function () {
        return {
            profileImage: GLOBALS.DEFAULT_PROFILE,
            isModerated: false
        };
    },
    componentDidMount: function () {
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
    },
    startUpload: function (e) {
        var self = this;
        e.stopPropagation();
        Cloudinary.load((e_, err) => {
            if (err != null) {
                Toast.error(UPLOAD_ERROR);
            }
            /* eslint-disable camelcase*/
            Cloudinary.instance.openUploadWidget({
                cloud_name: GLOBALS.CLOUDINARY_CLOUD_NAME || 'changemyworldnow',
                upload_preset: 'public-profile-image',
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
    },
    attemptNavigate: function () {
        if (this.props.data.user_id === this.props.currentUser.user_id ||
            (this.props.data && this.props.data.user_id === this.props.currentUser.user_id)) {
            History.push('/profile');
        }
    },
    renderImage: function (url) {
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
    },
    renderUploadButton: function () {
        if (this.props.data.user_id !== this.props.currentUser.user_id ||
            (this.props.data && this.props.data.user_id !== this.props.currentUser.user_id)) {
            return null;
        }
        if ((this.state.profileImage === GLOBALS.DEFAULT_PROFILE) || this.state.isModerated) {
            return (
                <button className="upload" onClick={this.startUpload}>Upload Image</button>
            );
        } else {
            return (
                <ButtonToolbar>
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
                        <Popover className="profile-image-popover" id="upload">
                            <strong>
                                {PENDINGHEADER}
                                <br />
                            </strong>
                            {PENDING}
                            <a onClick={this.startUpload}>
                                here.
                            </a>
                        </Popover>}>
                        <button className="upload">Upload Image</button>
                    </OverlayTrigger>
                </ButtonToolbar>
            );
        }
    },
    render: function () {
        // if (!this.props.currentUser || !this.props.user) {
            // return null;
        // }
        return (
            <div className={Classnames('profile-image', {'link-below': this.props['link-below']})} >
                {this.renderImage(this.state.profileImage)}
                {this.renderUploadButton()}
            </div>
        );
    }
});

export default Image;

