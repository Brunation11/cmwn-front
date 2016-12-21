import React from 'react';
import {Modal, ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import Classnames from 'classnames';

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
const UPLOAD_ERROR = 'There was a problem uploading your image. Please refresh the page and try again.';
const MODERATION = 'Your image has been submitted for moderation and should appear shortly.';
const PENDINGHEADER = 'Woah there World Changer!';
const PENDING = ' We\'re reviewing your image and it should appear shortly. ' +
                'Other users will continue to see your last approved image until we\'ve reviewed this one.' +
                'To continue uploading a new image click ';
const NO_IMAGE = 'Looks like there was a problem displaying this users profile. ' +
                'Please refresh the page to try again.';

const DEFAULT_IMGS = {
    ladybug: {
        bw: 'd6f52cd028ad1983d219dcc2fe10ea62.png',
        clr: ''
    },
    koala: {
        bw: '39d43c298e437c495816d0cadea8844a.png',
        clr: ''
    },
    kangaroo: {
        bw: 'd3dd73cf04943bbc29185996f5426e5b.png',
        clr: ''
    },
    jellyfish: {
        bw: 'eccfa11ad44408a113a467d473d27339.png',
        clr: ''
    },
    jaguar: {
        bw: '6ef0f68b2e78db2a76bbadc3c5fc39e4.png',
        clr: ''
    },
    impala: {
        bw: '79630826c3af9a97495002b6ca96135d.png',
        clr: ''
    },
    iguana: {
        bw: 'ed93bb069514b3e19e53d6dc026b2627.png',
        clr: ''
    },
    hummingbird: {
        bw: 'c7af5929ee812e08adab0c586ce74d6b.png',
        clr: ''
    },
    hound: {
        bw: '8a5321d3682819d27da4c07d02cd7961.png',
        clr: ''
    },
    heron: {
        bw: '5b1db5e0a43eb111aafd0cf1b4b8fed2.png',
        clr: ''
    },
    hedgehog: {
        bw: '06b79c605c1fd9641be08190235943fc.png',
        clr: ''
    },
    hamster: {
        bw: 'ff480c7d1c831b185d0a9c4a5046f4fb.png',
        clr: ''
    },
    guppy: {
        bw: '49a539a88380127c429c84cb22f1ac3c.png',
        clr: ''
    },
    goose: {
        bw: 'a97aa6420a87f1103bfc91132fc7f794.png',
        clr: ''
    },
    giraffe: {
        bw: 'ac359326f82cfa56a88209e622103d4e.png',
        clr: ''
    },
    gibbon: {
        bw: 'ebc3d2ab88ce74f30368cdbaae2ef75f.png',
        clr: ''
    },
    gazelle: {
        bw: '1d35f62ffb1285bf9680d3b3adfebd3f.png',
        clr: ''
    },
    frog: {
        bw: '0e8ad31f0ad006e39930e4610ab9f80e.png',
        clr: ''
    },
    fox: {
        bw: '1592364366054dc51de261e2bade13b3.png',
        clr: ''
    },
    flamingo: {
        bw: 'e68c82506b5df6e2d532b845c013a518.png',
        clr: ''
    },
    fish: {
        bw: '300b872f9c2f2d85194a7efa9e83547a.png',
        clr: ''
    },
    falcon: {
        bw: '74169471610eaa762df2a57b2a643e9a.png',
        clr: ''
    },
    emu: {
        bw: 'faca60d99f7e968337c44ae1a6f7da62.png',
        clr: ''
    },
    eagle: {
        bw: 'd6ade42ad7144c3b0ac88c0dfddea078.png',
        clr: ''
    },
    dragonfly: {
        bw: 'e58efef6c80228b75f10c015a929b45f.png',
        clr: ''
    },
    dolphin: {
        bw: '1c3d549c117086fd6e7b3de205cb8a9f.png',
        clr: ''
    },
    deer: {
        bw: 'f9151945f753a75d947c91d03275fa5f.png',
        clr: ''
    },
    crocodile: {
        bw: '5dbd19b8e96f3a920fff12373f30e018.png',
        clr: ''
    },
    crane: {
        bw: 'a26328367721bcf6747dcc4a1c8ef333.png',
        clr: ''
    },
    cayote: {
        bw: '7492d8aa7c130144db96a709673ede79.png',
        clr: ''
    },
    chipmunk: {
        bw: '634aefa4f0bb235c9bed10ee88760bd7.png',
        clr: ''
    },
    chinchilla: {
        bw: '0976685cbb31693f2f1b83bd85940ba1.png',
        clr: ''
    },
    chameleon: {
        bw: '788781fef697dd151c4d5cda2979906f.png',
        clr: ''
    },
    caterpillar: {
        bw: 'dbace4c34804a7b26e8fd6d020dc0f41.png',
        clr: ''
    },
    caribou: {
        bw: 'd684c74aa26b20f3e8f8d0352982873d.png',
        clr: ''
    },
    cardinal: {
        bw: '7dc1a0b773e6f3d4f054a8d8e09f6c70.png',
        clr: ''
    },
    butterfly: {
        bw: 'bb90e5c02e23b4c188c9844ff04284d9.png',
        clr: ''
    },
    bulldog: {
        bw: 'e977ec2c686100ff3e138ff1f813230d.png',
        clr: ''
    },
    bobcat: {
        bw: '7574ada9961c42e9e0d9471484fa8e2c.png',
        clr: ''
    },
    bluejay: {
        bw: '302a0f9e44f087932b94dc11323d41f9.png',
        clr: ''
    },
    bluefish: {
        bw: '190ebfab6d71cc533906aa011e5b1169.png',
        clr: ''
    },
    bluebird: {
        bw: '4c1adae796eaf03502151c906474c74e.png',
        clr: ''
    },
    bison: {
        bw: 'e0bd3c0585b92b90bef58784ee57db13.png',
        clr: ''
    },
    bee: {
        bw: '42dc6c7f9838af59a40b7bf466049b64.png',
        clr: ''
    },
    bear: {
        bw: 'fbf78274b18878ee8ffed45248955a1d.png',
        clr: ''
    },
    barracuda: {
        bw: '0295c4aac36ee53b4caed965fda04446.png',
        clr: ''
    },
    badger: {
        bw: 'ec4eb060506aed282f97ebd280c9a0ca.png',
        clr: ''
    },
    armadillo: {
        bw: '4ecff42a23aa2b747c06cbbeae7e8354.png',
        clr: ''
    },
    antelope: {
        bw: '45b09e6f894f2811cc0c9e712915947c.png',
        clr: ''
    },
    angelfish: {
        bw: '431d77e71fb42e51d82eb2c3663c2943.png',
        clr: ''
    },
    alligator: {
        bw: '34d5ce8d53c506711e60080d6aa8f66e.png',
        clr: ''
    }
}

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

    upload(postURL, imageURL, imageID) {
        HttpManager.POST({
            url: postURL
        }, {
            url: imageURL,
            image_id: imageID
        }).then(() => {
            Toast.error(MODERATION);
        }).catch(() => {
            Toast.error(UPLOAD_ERROR);
            Log.error(e, 'Failed image upload');
        });
    }

    cloudinaryUpload(e) {
        var self = this;
        var postURL = this.props.data._links.user_image.href;
        var imageURL;
        var imageID;

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
                imageURL = result[0].secure_url;
                imageID = result[0].public_id;

                self.setState({
                    profileImage: imageURL,
                    isModerated: false
                });

                ('set', 'dimension6', 1);


                this.upload(postURL, imageURL, imageID);
            });
            /* eslint-enable camelcase */
        });
    }

    defaultUpload(e) {
        var self = this;
        var postURL = this.props.data._links.user_image.href;
        var imageURL = `${GLOBALS.MEDIA_URL}${DEFAULT_IMGS[this.state.selected].clr}`;
        var imageID = imageURL.replace('.png', '');

        e.stopPropagation();

        // this.upload(postURL, imageURL, imageID);
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

    renderWelcome() {
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
                        onClick={this.cloudinaryUpload.bind(this)}
                    />
                </div>
                <div className="right">
                    <button
                        className="pick-one-from-our-avatar-btn"
                        onClick={this.setPage.bind(this, 'select-default')}
                    />
                </div>
            </div>
        );
    }

    renderSelectDefault() {
        return (
            <div className="select-default-container">
                <div className="avatar-container">
                    {_.map(DEFAULT_IMGS, (value, key) => {
                        return (
                            <div
                                onClick={() => {
                                    this.setState({
                                        selected: key
                                    });
                                }}
                                className={Classnames(
                                    `avatar ${key}`,
                                     {
                                        disable: this.state.selected === key
                                     }
                                )}
                                key={Shortid.generate()}
                            >
                                <img
                                    className="clr"
                                    src={`${GLOBALS.MEDIA_URL}${value.clr}`}
                                />
                                <img
                                    className="bw"
                                    src={`${GLOBALS.MEDIA_URL}${value.bw}`}
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
                <button
                    className="confirm"
                    onClick={this.setPage.bind(this, 'confirm')}
                />
                <button className="cancel"
                    onClick={this.setPage.bind(this, 'welcome')}
                />
            </div>
        );
    }

    renderConfirm() {
        return (
            <div className="confirm-container">
                <div className="left">
                    <span className="header">
                        REVIEW
                    </span>
                    <span className="prompt-1">
                        YOUR NEW PROFILE PHOTO
                    </span>
                    <img className="selected-avatar" src={`${GLOBALS.MEDIA_URL}${DEFAULT_IMGS[this.state.selected].clr}`} />
                    <span className="prompt-2">
                        USERNAME HERE
                    </span>
                </div>
                <div className="right">
                    <span className="header">
                        CONFIRM
                    </span>
                    <button
                        className="looks-great-btn"
                        onClick={this.defaultUpload.bind(this)}
                    />
                    <button
                        className="change-my-mind-btn"
                        onClick={this.setPage.bind(this, 'select-default')}
                    />
                    <button
                        className="back-to-upload-btn"
                        onClick={this.cloudinaryUpload.bind(this)}
                    />
                </div>
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
            page.call(this)
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
