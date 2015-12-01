import React from 'react';
import Classnames from 'classnames';

import Cloudinary from 'components/cloudinary';
import Toast from 'components/toast';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

import 'components/profile_image.scss';

const PIC_ALT = 'Profile Picture';
const UPLOAD_ERROR = 'There was a problem uploading your image. Please refresh the page and try again.';

var Image = React.createClass({
    getInitialState: function () {
        return {
            profileImage: GLOBALS.DEFAULT_PROFILE
        };
    },
    startUpload: function () {
        var self = this;
        Cloudinary.load((e, err) => {
            if (err != null) {
                Toast.error(UPLOAD_ERROR);
            }
            /* eslint-disable camelcase*/
            Cloudinary.instance.openUploadWidget({
                cloud_name: 'dyf9catvs',
                upload_preset: 'hgkcitbs',
                multiple: false,
                cropping: 'server',
                gravity: 'custom',
                cropping_aspect_ratio: 1,
                theme: 'minimal',
            }, (error, result) => {
                self.setState({profileImage: result[0].secure_url});
                HttpManager.POST({url: `${GLOBALS.API_URL}/updateimage`}, {
                    url: result[0].secure_url,
                    id: result[0].public_id
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
    render: function () {
        return (
            <div className={Classnames('profile-image', {'link-below': this.props['link-below']})} >
                {this.renderImage(this.state.profileImage)}
                <div className="upload" onClick={this.startUpload}>Upload Image</div>
                <div className="below"><a onClick={this.startUpload}>Upload New Image</a></div>
            </div>
        );
    }
});

export default Image;

