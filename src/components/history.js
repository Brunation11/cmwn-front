import { browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Store from 'components/store';

const history = syncHistoryWithStore(browserHistory, Store, {selectLocationState: state => {
    var routing = state.getIn(['routing', 'locationBeforeTransitions']);
    if (routing == null) {
        return {locationBeforeTransitions: null};
    }
    return {locationBeforeTransitions: state.getIn(['routing', 'locationBeforeTransitions']).toObject()};
}});

export default history;
