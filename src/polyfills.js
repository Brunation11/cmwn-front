import 'components/polyfills/xhr';
import 'components/polyfills/to_iso_string';
import {btoa} from 'base64';

if (window.btoa == null) {
    window.btoa = btoa;
}

