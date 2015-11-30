import CreateBrowserHistory from 'history/lib/createBrowserHistory';
import UseBeforeUnload from 'history/lib/useBeforeUnload';

export default UseBeforeUnload(CreateBrowserHistory)();
