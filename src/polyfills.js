import 'components/polyfills/xhr';
import {btoa} from 'base64';

if (window.btoa == null) {
    window.btoa = btoa;
}

