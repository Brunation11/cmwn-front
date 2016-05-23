import { browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from 'components/store';

var history;
try {
    history = syncHistoryWithStore(browserHistory, Store);
} catch(err) {
    console.log(err);
}

export default history;
