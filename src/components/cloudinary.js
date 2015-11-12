import _ from 'lodash';
import Loader from 'components/loader';

const CLOUDINARY_URLS = [
    '//widget.cloudinary.com/global/all.js'
/* lets avoid loading as much as possible for now */
//    'jquery.min.js',
//    'jquery.ui.widget.js',
//    'jquery.iframe-transport.js',
//    'jquery.fileupload.js',
//    'jquery.cloudinary.js'
];

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
                        rej(err);
                    }
                });
            });
            Promise.all(promises).then(e => {
                this._loaded = true;
                this.instance = window.cloudinary;
                callback(e); //intentionally stripping additional args
            }).catch( err => {
                /** @TODO MPR, 11/13/15: gracefully handle cloudinary load failures, warning the user they
                 * will not be able to upload at this time. Possibly give option to refresh*/
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

