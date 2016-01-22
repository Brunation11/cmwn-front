import _ from 'lodash';

import Loader from 'components/loader';
import Toast from 'components/toast';
import Log from 'components/log';

const CLOUDINARY_URLS = [
    '//widget.cloudinary.com/global/all.js'
/* lets avoid loading as much as possible for now */
//    'jquery.min.js',
//    'jquery.ui.widget.js',
//    'jquery.iframe-transport.js',
//    'jquery.fileupload.js',
//    'jquery.cloudinary.js'
];

const UPLOAD_ERROR = 'Your image could not be uploaded at this time. Please try again later.';

/**
 * Singleton. Used to manage lazy loading the cloudinary instance
 * as it wants jquery. Currently just dumps window.cloudinary on
 * this.instance. In the future it may make sense to map the cloudinary
 * methods themselves to make this a full-fledged react-cloudinary
 * plugin which could be open sourced.
 */
class _Cloudinary {
    constructor() {
        this._loaded = false;
    }
    /**
     * loads cloudinary.
     * @param {function} callback - function to execute once cloudinary is loaded
     * has signature callback(event, error). Event will only be populated if files
     * have not already been previously loaded.
     */
    load(callback) {
        if (!this.isLoaded) {
            var promises = _.map(CLOUDINARY_URLS, url => {
                return new Promise((res, rej) => {
                    try {
                        Loader(url, res);
                    } catch (err) {
                        Log.warn('Cloudinary could not load');
                        rej(err);
                    }
                });
            });
            Promise.all(promises).then(e => {
                this._loaded = true;
                this.instance = window.cloudinary;
                callback(e); //intentionally stripping additional args
            }).catch( err => {
                Toast.error(UPLOAD_ERROR);
                Log.error('Cloudinary not loaded');
                callback(null, err);
            });
        } else {
            callback();
        }
    }
    get isLoaded() {
        return this._loaded;
    }
}

var Cloudinary = new _Cloudinary();

export default Cloudinary;

