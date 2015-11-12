import React from 'react';

import Cloudinary from 'components/cloudinary';
import GLOBALS from 'components/globals';

import 'components/profile_image.scss';

const PIC_ALT = 'Profile Picture';

var Image = React.createClass({
    getInitialState: function () {
        return {
            profileImage: GLOBALS.CURRENT_USER.PROFILE_IMAGE
        };
    },
    startUpload: function () {
        var self = this;
        Cloudinary.load((e, err) => {
            if (err != null) {
                /** @TODO MPR, 11/13/15: Warn the user once we have some toasts */
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
                /** @TODO MPR, 11/13/15: Send url and id to server */
                //result[0].public_id
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
            <div className="profile-image">
                {this.renderImage(this.state.profileImage)}
                <div className="upload" onClick={this.startUpload}>Upload Image</div>
            </div>
        );
    }
});

export default Image;

