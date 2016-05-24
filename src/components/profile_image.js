import React from 'react';
import {Button, ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap'
import Classnames from 'classnames';
import { connect } from 'react-redux';

import Cloudinary from 'components/cloudinary';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Log from 'components/log';
import Store from 'components/store';

import 'components/profile_image.scss';

const PIC_ALT = 'Profile Picture';
const UPLOAD_ERROR = 'There was a problem uploading your image. Please refresh the page and try again.';
const MODERATION = 'Your image has been submitted for moderation and should appear shortly.';
const PENDING = 'Woah there World Changer! We\'re reviewing your image and it should appear shortly. To continue uploading a new image click ';
// const NO_IMAGE = 'There was a problem displaying your profile image. Please refresh the page to try again';

var Component = React.createClass({
    getInitialState: function () {
        return {
            profileImage: GLOBALS.DEFAULT_PROFILE,
            isModerated: false
        };
    },
    componentDidMount: function () {
        var state = Store.getState();
        if (this.props.user_id === state.currentUser.user_id) {
            if (this.props.currentUser._embedded.image) {
                this.setState({profileImage: this.props.currentUser._embedded.image.url});
                this.setState({isModerated: this.props.currentUser._embedded.image.isModerated});
            }
        } else {
            this.setState({profileImage: GLOBALS.DEFAULT_PROFILE});
            /** @TODO MPR, 3/9/16: get image from server when not available */
            /*HttpManager.GET({url: `${GLOBALS.API_URL}users/${this.props.user_id}/image`, handleErrors: false})
                .then(res => {
                    if (res && res.response && res.response.data && res.response.data.length && _.isString(_.last(res.response.data).url)) {
                        this.setState({profileImage: _.last(res.response.data).url});
                    }
                }).catch(e => {
                    Toast.error(NO_IMAGE);
                    Log.debug(e, 'Image could not be extracted from user');
                });
            */
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
                cloud_name: 'changemyworldnow',
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
                HttpManager.POST({url: this.props.data.user_image.href}, {
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
    renderImage: function (url) {
        var style = {'backgroundImage': `url(${url})`};
        return (
             <div
                className="profile-pic"
                alt={PIC_ALT}
                style={style}
            >
                 {PIC_ALT}
            </div>
        );
    },
    renderUploadButton: function () {
        if (!this.props.currentUser._embedded.image || this.state.isModerated) {
            return (
                <button className="upload" onClick={this.startUpload}>Upload Image</button>
            )
        } else {
            return (
                <ButtonToolbar>
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover>{PENDING}<strong style={{color: "7829bb"}} onClick={this.startUpload}>here.</strong></Popover>}>
                        <button className="upload">Upload Image</button>
                    </OverlayTrigger>
                </ButtonToolbar>
            )
        }
    },
    render: function () {
        if (this.props.user_id == null) {
            return null;
        }
        return (
            <div className={Classnames('profile-image', {'link-below': this.props['link-below']})} >
                {this.renderImage(this.state.profileImage)}
                {this.renderUploadButton()}
            </div>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    state.currentUser;
    if (state.currentUser && state.currentUser._links) {
        data = state.currentUser._links;
    }
    return { currentUser: state.currentUser, data };
};

var Image = connect(mapStateToProps)(Component);

export default Image;

