import _ from 'lodash';
import { browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from 'components/store';
import History from 'mocks/mock_history';

var history = {
    listen: _.noop,
    listenBefore: _.noop
};

if (__cmwn.MODE === 'test') {
    history = new History();
} else {
    try {
        history = syncHistoryWithStore(browserHistory, Store);
    } catch(err) {
        console.log(err); //eslint-disable-line no-console
    }
}

export default history;
