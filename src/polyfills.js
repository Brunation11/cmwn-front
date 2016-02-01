import 'components/polyfills/xhr';
import {btoa} from 'base64';
import bind from 'components/polyfills/object'; //eslint-disable-line no-unused-vars

if (window.btoa == null) {
    window.btoa = btoa;
}

