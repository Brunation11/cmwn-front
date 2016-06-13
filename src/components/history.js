import _ from 'lodash';
import { browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from 'components/store';

var history = {
    listen: _.noop,
    listenBefore: _.noop
};
try {
    history = syncHistoryWithStore(browserHistory, Store);
} catch(err) {
    console.log(err); //eslint-disable-line no-console
}

export default history;
