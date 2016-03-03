import { browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from 'components/store';

const history = syncHistoryWithStore(browserHistory, Store);

export default history;
